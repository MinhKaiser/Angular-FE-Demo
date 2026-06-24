import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Comment,
  CommentsResponse,
  CreateCommentRequest,
  DeletedComment,
  PaginationQuery,
  UpdateCommentRequest,
} from '@shared/models';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly httpClient = inject(HttpClientService);

  getComments(query?: PaginationQuery): Observable<CommentsResponse> {
    return this.httpClient.get<CommentsResponse>('/comments', query);
  }

  getComment(id: number): Observable<Comment> {
    return this.httpClient.get<Comment>(`/comments/${id}`);
  }

  getCommentsByPost(postId: number, query?: PaginationQuery): Observable<CommentsResponse> {
    return this.httpClient.get<CommentsResponse>(`/comments/post/${postId}`, query);
  }

  addComment(comment: CreateCommentRequest): Observable<Comment> {
    return this.httpClient.post<Comment, CreateCommentRequest>('/comments/add', comment);
  }

  updateComment(id: number, comment: UpdateCommentRequest): Observable<Comment> {
    return this.httpClient.patch<Comment, UpdateCommentRequest>(`/comments/${id}`, comment);
  }

  deleteComment(id: number): Observable<DeletedComment> {
    return this.httpClient.delete<DeletedComment>(`/comments/${id}`);
  }
}
