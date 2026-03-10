import { Injectable, signal } from '@angular/core';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    category: string;
}

export interface Video {
    id: string;
    title: string;
    author: string;
    thumbnail: string;
    views: string;
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class DummyDataService {
    products = signal<Product[]>([]);
    videos = signal<Video[]>([]);
    loading = signal<boolean>(false);

    async fetchMarketplace(): Promise<void> {
        this.loading.set(true);
        try {
            const resp = await fetch('https://dummyjson.com/products?limit=20');
            const data = await resp.json();
            this.products.set(data.products);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            this.loading.set(false);
        }
    }

    async fetchVideos(): Promise<void> {
        this.loading.set(true);
        try {
            // Using dummy posts as "videos" metadata for now
            const resp = await fetch('https://dummyjson.com/posts?limit=12&skip=50');
            const data = await resp.json();
            const mappedVids: Video[] = data.posts.map((p: any) => ({
                id: `vid_${p.id}`,
                title: p.title,
                author: `Channel ${p.userId}`,
                thumbnail: `https://picsum.photos/seed/vid${p.id}/400/225`,
                views: `${Math.floor(Math.random() * 1000)}K views`,
                timestamp: `${Math.floor(Math.random() * 24)} hours ago`
            }));
            this.videos.set(mappedVids);
        } catch (err) {
            console.error('Failed to fetch videos', err);
        } finally {
            this.loading.set(false);
        }
    }
}
