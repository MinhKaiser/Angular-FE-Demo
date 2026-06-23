import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getEnvironmentConfig } from './environment.service';
import { PaginationQuery } from '@shared/models';

type QueryParamValue = string | number | boolean | readonly string[] | null | undefined;
type QueryRecord = Record<string, QueryParamValue>;
export type QueryParams = PaginationQuery | QueryRecord;

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private readonly config = getEnvironmentConfig();
  private readonly baseUrl = this.config.apiUrl;

  constructor(private http: HttpClient) {}

  get<TResponse>(endpoint: string, query?: QueryParams): Observable<TResponse> {
    return this.http.get<TResponse>(this.buildUrl(endpoint), {
      params: this.buildParams(query),
    });
  }

  post<TResponse, TBody extends object>(endpoint: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.buildUrl(endpoint), body);
  }

  put<TResponse, TBody extends object>(endpoint: string, body: TBody): Observable<TResponse> {
    return this.http.put<TResponse>(this.buildUrl(endpoint), body);
  }

  patch<TResponse, TBody extends object>(endpoint: string, body: TBody): Observable<TResponse> {
    return this.http.patch<TResponse>(this.buildUrl(endpoint), body);
  }

  delete<TResponse>(endpoint: string): Observable<TResponse> {
    return this.http.delete<TResponse>(this.buildUrl(endpoint));
  }

  private buildUrl(endpoint: string): string {
    return endpoint.startsWith('/') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/${endpoint}`;
  }

  private buildParams(query?: QueryParams): HttpParams {
    let params = new HttpParams();

    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      const normalizedValue = Array.isArray(value) ? value.join(',') : String(value);
      params = params.set(key, normalizedValue);
    });

    return params;
  }
}
