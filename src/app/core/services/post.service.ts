import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommentsResponse,
  CreatePostRequest,
  DeletedPost,
  PaginationQuery,
  Post,
  PostsResponse,
  PostTag,
  UpdatePostRequest,
} from '@shared/models';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClientService) {}

  getPosts(query?: PaginationQuery): Observable<PostsResponse> {
    return this.httpClient.get<PostsResponse>('/posts', query);
  }

  getPost(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`/posts/${id}`);
  }

  searchPosts(searchTerm: string, query?: PaginationQuery): Observable<PostsResponse> {
    return this.httpClient.get<PostsResponse>('/posts/search', {
      ...query,
      q: searchTerm.trim(),
    });
  }

  getPostTags(): Observable<PostTag[]> {
    return this.httpClient.get<PostTag[]>('/posts/tags');
  }

  getPostTagList(): Observable<string[]> {
    return this.httpClient.get<string[]>('/posts/tag-list');
  }

  getPostsByTag(tagSlug: string, query?: PaginationQuery): Observable<PostsResponse> {
    return this.httpClient.get<PostsResponse>(`/posts/tag/${tagSlug}`, query);
  }

  getPostsByUser(userId: number, query?: PaginationQuery): Observable<PostsResponse> {
    return this.httpClient.get<PostsResponse>(`/posts/user/${userId}`, query);
  }

  getPostComments(postId: number, query?: PaginationQuery): Observable<CommentsResponse> {
    return this.httpClient.get<CommentsResponse>(`/posts/${postId}/comments`, query);
  }

  addPost(post: CreatePostRequest): Observable<Post> {
    return this.httpClient.post<Post, CreatePostRequest>('/posts/add', post);
  }

  updatePost(id: number, post: UpdatePostRequest): Observable<Post> {
    return this.httpClient.patch<Post, UpdatePostRequest>(`/posts/${id}`, post);
  }

  deletePost(id: number): Observable<DeletedPost> {
    return this.httpClient.delete<DeletedPost>(`/posts/${id}`);
  }
}
