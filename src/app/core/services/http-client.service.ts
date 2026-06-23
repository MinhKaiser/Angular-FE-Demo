import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getEnvironmentConfig } from './environment.service';

export interface PaginationOptions {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;      // Field to sort by
  order?: 'asc' | 'desc'; // Sort order
  delay?: number;       // Delay response in ms (0-5000)
  filter?: string;      // Filter string (API-specific)
}

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private readonly config = getEnvironmentConfig();
  private readonly baseUrl = this.config.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: PaginationOptions): Observable<T> {
    let params = new HttpParams();
    if (options?.limit) {
      params = params.set('limit', options.limit.toString());
    }
    if (options?.skip) {
      params = params.set('skip', options.skip.toString());
    }
    if (options?.select) {
      params = params.set('select', options.select);
    }
    if (options?.sortBy) {
      params = params.set('sortBy', options.sortBy);
    }
    if (options?.order) {
      params = params.set('order', options.order);
    }
    if (options?.delay) {
      params = params.set('delay', options.delay.toString());
    }
    if (options?.filter) {
      params = params.set('filter', options.filter);
    }

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
