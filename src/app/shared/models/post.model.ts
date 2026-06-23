import { DeletedResource, PaginatedResponse } from './api.model';

export interface CommentUser {
  id: number;
  username: string;
  fullName: string;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: CommentUser;
}

export interface CommentsResponse extends PaginatedResponse {
  comments: Comment[];
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface PostsResponse extends PaginatedResponse {
  posts: Post[];
}

export interface PostTag {
  slug: string;
  name: string;
  url: string;
}

export interface CreatePostRequest {
  title: string;
  body?: string;
  userId: number;
  tags?: string[];
}

export type UpdatePostRequest = Partial<CreatePostRequest>;

export interface CreateCommentRequest {
  body: string;
  postId: number;
  userId: number;
}

export interface UpdateCommentRequest {
  body: string;
}

export type DeletedPost = Post & DeletedResource;
export type DeletedComment = Comment & DeletedResource;
