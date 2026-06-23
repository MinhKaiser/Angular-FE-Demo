export type SortOrder = 'asc' | 'desc';

export interface PaginatedResponse {
  total: number;
  skip: number;
  limit: number;
}

export interface PaginationQuery {
  limit?: number;
  skip?: number;
  select?: string | readonly string[];
  sortBy?: string;
  order?: SortOrder;
  delay?: number;
}

export interface DeletedResource {
  isDeleted: boolean;
  deletedOn: string;
}
