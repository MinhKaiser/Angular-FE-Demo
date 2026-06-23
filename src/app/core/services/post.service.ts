import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, PostsResponse, Comment, CommentsResponse } from '@shared/models';
import { HttpClientService, PaginationOptions } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClientService) {}

  getAllPosts(options?: PaginationOptions): Observable<PostsResponse> {
    return this.httpClient.get<PostsResponse>('/posts', options);
  }

  getPostById(id: number, options?: PaginationOptions): Observable<Post> {
    return this.httpClient.get<Post>(`/posts/${id}`, options);
  }

  searchPosts(query: string, options?: PaginationOptions): Observable<PostsResponse> {
    return this.httpClient.get<PostsResponse>(`/posts/search?q=${query}`, options);
  }

  getPostsByUserId(userId: number, options?: PaginationOptions): Observable<PostsResponse> {
    return this.httpClient.get<PostsResponse>(`/posts/user/${userId}`, options);
  }

  getCommentsByPostId(postId: number, options?: PaginationOptions): Observable<CommentsResponse> {
    return this.httpClient.get<CommentsResponse>(`/posts/${postId}/comments`, options);
  }

  addPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.httpClient.post<Post>('/posts/add', post);
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.httpClient.put<Post>(`/posts/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.httpClient.delete(`/posts/${id}`);
  }
}
