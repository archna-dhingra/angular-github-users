import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, forkJoin } from 'rxjs';

const headers = new HttpHeaders().set('Authorization', 'bearer 9142637ed748f3a8cc5a24da7f2e189b83fab244');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  fetchAllUsers(searchQuery: string, page?: number): Observable<GithubUserApiResponse> {
    let params = new HttpParams().set('q', searchQuery ? searchQuery : 'a')
    .set('page', page ? `${page + 1}` : '1');
    return this.http.get<GithubUserApiResponse>('https://api.github.com/search/users', { headers, params });
  }

  fetchUserDetails(userId: string) {
    let params = new HttpParams().set('per_page', '100');
    return forkJoin(this.http.get<GithubUser>('https://api.github.com/users/' + userId, { headers }),
      this.http.get<GithubUserRepos[]>('https://api.github.com/users/' + userId + '/repos', { headers, params }));
  }

  fetchSearchedRepository(userId: string, repositorySeachQuery: string): Observable<GithubReposApiResponse> {
    let params = new HttpParams().set('q', repositorySeachQuery+'+user:'+userId)
    .set('per_page', '100');
    return this.http.get<GithubReposApiResponse>('https://api.github.com/search/repositories?q='+repositorySeachQuery+'+user:'+userId, { headers, params });
  }

  fetchAllRepositories(userId: string) {
    let params = new HttpParams().set('per_page', '100');
    return this.http.get<GithubUserRepos[]>('https://api.github.com/users/' + userId + '/repos', { headers, params });
  }
}

export interface GithubUserApiResponse {
  items: GithubUser[];
  total_count: number;
}

export interface GithubReposApiResponse {
  items: GithubUserRepos[];
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