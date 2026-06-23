import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '@core/services';
import { Post } from '@shared/models';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Posts</h1>
        
        <div *ngIf="isLoading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!isLoading && posts.length > 0" class="space-y-4">
          <article *ngFor="let post of posts" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ post.title }}</h2>
            <p class="text-gray-600 mb-4">{{ post.body }}</p>
            <div class="flex items-center justify-between">
              <div class="flex gap-4 text-sm text-gray-500">
                <span>👁️ {{ post.views }} views</span>
                <span>👍 {{ post.reactions.likes }} likes</span>
              </div>
              <button [routerLink]="['/posts', post.id]" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Read More
              </button>
            </div>
          </article>
        </div>

        <div *ngIf="!isLoading && posts.length === 0" class="text-center py-12">
          <p class="text-gray-600">No posts found</p>
        </div>
      </div>
    </div>
  `,
})
export class PostsListComponent implements OnInit {
  private postService = inject(PostService);
  
  posts: Post[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.postService.getAllPosts({ limit: 20, skip: 0 }).subscribe({
      next: (response) => {
        this.posts = response.posts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.isLoading = false;
      },
    });
  }
}
