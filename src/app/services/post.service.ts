import { Injectable, signal } from '@angular/core';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  replies: Comment[];
  showReply?: boolean;
}

export interface Post {
  id: string;
  author: string;
  authorImage?: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  liked: boolean;
  image?: string;
  postComments: Comment[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly STORAGE_KEY = 'connectify_posts';
  private readonly COMMENTS_KEY = 'connectify_comments';

  posts = signal<Post[]>([]);

  private userMap = new Map<number, { name: string, image: string }>();
  private maxSkip = 500;

  // Expose pagination state
  hasMorePosts = signal<boolean>(true);
  loadingPosts = signal<boolean>(false);
  private currentSkip = 0;

  constructor() {
    this.loadPosts();
    this.preloadUsers().then(() => {
      this.loadFakePosts(0, 50);
    });
    // Listen for user updates
    if (typeof window !== 'undefined') {
      window.addEventListener('userUpdated', () => {
        this.refreshUserPosts();
      });
    }
  }

  private loadPosts(): void {
    const storedPosts = localStorage.getItem(this.STORAGE_KEY);
    if (storedPosts) {
      try {
        const posts = JSON.parse(storedPosts)
          .map((post: any) => ({
            ...post,
            timestamp: new Date(post.timestamp),
            postComments: post.postComments || []
          }))
          .filter((post: any) => {
            const author = post.author || '';
            // Strictly filter out unwanted names
            return !author.startsWith('User ') &&
              author !== 'Mike Chen' &&
              author !== 'Emily Davis' &&
              author !== 'John Doe';
          });
        this.posts.set(posts);
        // Save back filtered list to keep it clean
        this.savePosts();
      } catch (error) {
        this.posts.set([]);
      }
    }
  }

  private async preloadUsers(): Promise<void> {
    try {
      // DummyJSON has 208 max users, we fetch a large batch to cache proper names and avatars
      const response = await fetch('https://dummyjson.com/users?limit=200&select=firstName,lastName,image');
      const data = await response.json();
      for (const user of data.users) {
        this.userMap.set(user.id, {
          name: `${user.firstName} ${user.lastName}`,
          image: user.image
        });
      }
    } catch (error) {
      console.error('Failed to preload users:', error);
    }
  }

  async loadMoreFakePosts(): Promise<void> {
    if (!this.hasMorePosts() || this.loadingPosts()) return;
    await this.loadFakePosts(this.currentSkip, 50);
  }

  private async loadFakePosts(skip: number, limit: number): Promise<void> {
    if (skip >= this.maxSkip) {
      this.hasMorePosts.set(false);
      return;
    }

    this.loadingPosts.set(true);
    try {
      const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
      const data = await response.json();

      const newPosts: Post[] = data.posts
        .map((fakePost: any) => {
          const mappedUser = this.userMap.get(fakePost.userId);
          if (!mappedUser) return null;

          return {
            id: `dummy_${fakePost.id}`,
            author: mappedUser.name,
            authorImage: mappedUser.image,
            content: fakePost.body,
            timestamp: new Date(),
            likes: fakePost.reactions?.likes || Math.floor(Math.random() * 100),
            comments: 0,
            liked: false,
            image: `https://picsum.photos/seed/${fakePost.id}/500/300`,
            postComments: []
          };
        })
        .filter((post: any): post is Post => post !== null && !post.author.startsWith('User '));

      const currentPosts = this.posts();
      const existingIds = new Set(currentPosts.map(p => p.id));
      const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));

      if (uniqueNewPosts.length > 0) {
        this.posts.set([...currentPosts, ...uniqueNewPosts]);
      }

      this.currentSkip += limit;
      if (this.currentSkip >= this.maxSkip || this.currentSkip >= data.total) {
        this.hasMorePosts.set(false);
      }
    } catch (error) {
      console.error('Failed to load fake posts:', error);
    } finally {
      this.loadingPosts.set(false);
    }
  }

  addPost(content: string, imageFile?: File): void {
    // Get current user name - fallback to 'John Doe' if not available
    const userName = typeof window !== 'undefined' && localStorage.getItem('connectify_user')
      ? JSON.parse(localStorage.getItem('connectify_user')!).name
      : 'John Doe';

    const newPost: Post = {
      id: Date.now().toString(),
      author: userName,
      content,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      liked: false,
      postComments: []
    };

    if (imageFile) {
      this.convertImageToBase64(imageFile).then(base64 => {
        newPost.image = base64;
        this.posts.set([newPost, ...this.posts()]);
        this.savePosts();
      });
    } else {
      this.posts.set([newPost, ...this.posts()]);
      this.savePosts();
    }
  }

  private savePosts(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.posts().filter(p => !p.id.startsWith('dummy_'))));
  }

  updatePost(postId: string, updates: Partial<Post>): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post =>
      post.id === postId ? { ...post, ...updates } : post
    );
    this.posts.set(updatedPosts);
    this.savePosts();
  }

  updatePostWithImage(postId: string, content: string, imageFile: File): void {
    this.convertImageToBase64(imageFile).then(base64 => {
      this.updatePost(postId, { content, image: base64 });
    });
  }

  deletePost(postId: string): void {
    const currentPosts = this.posts();
    const filteredPosts = currentPosts.filter(post => post.id !== postId);
    this.posts.set(filteredPosts);
    this.savePosts();
  }

  toggleLike(postId: string): void {
    const post = this.posts().find(p => p.id === postId);
    if (post) {
      const liked = !post.liked;
      const likes = post.likes + (liked ? 1 : -1);
      this.updatePost(postId, { liked, likes });
    }
  }

  addComment(postId: string, text: string): void {
    const userName = typeof window !== 'undefined' && localStorage.getItem('connectify_user')
      ? JSON.parse(localStorage.getItem('connectify_user')!).name
      : 'John Doe';

    const newComment: Comment = {
      id: Date.now().toString(),
      author: userName,
      text,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      replies: []
    };

    const post = this.posts().find(p => p.id === postId);
    if (post) {
      post.postComments.push(newComment);
      post.comments = post.postComments.length + this.countReplies(post.postComments);
      this.posts.set([...this.posts()]);
      this.savePosts();
    }
  }

  addReply(postId: string, commentId: string, text: string): void {
    const userName = typeof window !== 'undefined' && localStorage.getItem('connectify_user')
      ? JSON.parse(localStorage.getItem('connectify_user')!).name
      : 'John Doe';

    const newReply: Comment = {
      id: Date.now().toString(),
      author: userName,
      text,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      replies: []
    };

    const post = this.posts().find(p => p.id === postId);
    if (post) {
      const comment = this.findComment(post.postComments, commentId);
      if (comment) {
        comment.replies.push(newReply);
        comment.showReply = false;
        post.comments = post.postComments.length + this.countReplies(post.postComments);
        this.posts.set([...this.posts()]);
        this.savePosts();
      }
    }
  }

  toggleCommentLike(postId: string, commentId: string): void {
    const post = this.posts().find(p => p.id === postId);
    if (post) {
      const comment = this.findComment(post.postComments, commentId);
      if (comment) {
        comment.liked = !comment.liked;
        comment.likes += comment.liked ? 1 : -1;
        this.posts.set([...this.posts()]);
        this.savePosts();
      }
    }
  }

  toggleReply(postId: string, commentId: string): void {
    const post = this.posts().find(p => p.id === postId);
    if (post) {
      const comment = this.findComment(post.postComments, commentId);
      if (comment) {
        comment.showReply = !comment.showReply;
        this.posts.set([...this.posts()]);
      }
    }
  }

  getPostComments(postId: string): Comment[] {
    const post = this.posts().find(p => p.id === postId);
    return post ? post.postComments : [];
  }

  private findComment(comments: Comment[], commentId: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      const found = this.findComment(comment.replies, commentId);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private countReplies(comments: Comment[]): number {
    let count = 0;
    for (const comment of comments) {
      count += comment.replies.length;
      count += this.countReplies(comment.replies);
    }
    return count;
  }

  refreshUserPosts(): void {
    const currentUser = typeof window !== 'undefined' && localStorage.getItem('connectify_user')
      ? JSON.parse(localStorage.getItem('connectify_user')!)
      : null;

    if (currentUser) {
      const currentPosts = this.posts();
      const updatedPosts = currentPosts.map(post => {
        // Update all posts that have the old name or are user's posts
        if (post.author === 'John Doe' || post.author === currentUser.name) {
          return { ...post, author: currentUser.name };
        }
        return post;
      });
      this.posts.set(updatedPosts);
      this.savePosts();
    }
  }

  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}