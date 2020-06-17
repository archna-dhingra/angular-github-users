import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  fetchAllUsers(searchQuery: string, page?: number): Observable<GithubApiResponse> {
    let params = new HttpParams().set('q', searchQuery ? searchQuery : 'a')
    .set('page', page ? `${page + 1}` : '1');
    let headers = new HttpHeaders().set('Authorization', 'bearer <your-token>');
    return this.http.get<GithubApiResponse>('https://api.github.com/search/users', { headers, params });
  }

  fetchUserDetails(userId: string) {
    let headers = new HttpHeaders().set('Authorization', 'bearer <your-token>');
    return forkJoin(this.http.get<GithubUser>('https://api.github.com/users/' + userId, { headers }),
      this.http.get<GithubUserRepos[]>('https://api.github.com/users/' + userId + '/repos', { headers }));
  }
}

export interface GithubApiResponse {
  items: GithubUser[];
  total_count: number;
}

export interface GithubUser {
  avatar_url: string;
  login: string;
  name?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
}

export interface GithubUserRepos {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  forks: number;
  license: string;
  lastUpdatedOn: string;
  updated_at: string;
}