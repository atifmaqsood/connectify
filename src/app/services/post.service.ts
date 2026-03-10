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

  constructor() {
    this.loadPosts();
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
        const posts = JSON.parse(storedPosts).map((post: any) => ({
          ...post,
          timestamp: new Date(post.timestamp),
          postComments: post.postComments || []
        }));
        this.posts.set(posts);
      } catch (error) {
        // If parsing fails or structure is invalid, reinitialize
        this.initializeDefaultPosts();
      }
    } else {
      this.initializeDefaultPosts();
    }
  }

  private initializeDefaultPosts(): void {
    const userName = typeof window !== 'undefined' && localStorage.getItem('connectify_user') 
      ? JSON.parse(localStorage.getItem('connectify_user')!).name 
      : 'John Doe';
    
    const defaultPosts: Post[] = [
      {
        id: '1',
        author: userName,
        content: 'Excited to share that our team just completed the Q4 project ahead of schedule! 🎉 Great collaboration everyone!',
        timestamp: new Date(),
        likes: 24,
        comments: 8,
        liked: false,
        image: 'https://via.placeholder.com/500x300',
        postComments: []
      },
      {
        id: '2',
        author: 'Mike Chen',
        content: 'Looking forward to the upcoming tech conference next week. Who else is attending? Let\'s connect!',
        timestamp: new Date(Date.now() - 3600000),
        likes: 15,
        comments: 5,
        liked: true,
        postComments: []
      },
      {
        id: '3',
        author: 'Emily Davis',
        content: 'Just finished an amazing workshop on AI and Machine Learning. The future of technology is so exciting! 🤖',
        timestamp: new Date(Date.now() - 7200000),
        likes: 32,
        comments: 12,
        liked: false,
        image: 'https://via.placeholder.com/500x250',
        postComments: []
      }
    ];
    this.posts.set(defaultPosts);
    this.savePosts();
  }

  private savePosts(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.posts()));
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