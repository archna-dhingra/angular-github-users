import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

import { GithubUser } from "../shared/user.service";

@Component({
  selector: 'users-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit {
  userSeachQuery: string = '';
  displayedColumns: string[] = ['profilePic', 'username'];
  usersData: GithubUser[] = [];
  userDataLength = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readonly userService: UserService) { }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.userService.fetchAllUsers(
            this.userSeachQuery, this.paginator.pageIndex);
        }),
        map(data => {
          this.userDataLength = data.total_count;
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      ).subscribe(data => {
        console.log('data');
        console.log(data);
        this.usersData = data
      });
  }

  loadUsers() {
    this.userService.fetchAllUsers(this.userSeachQuery).subscribe(users => {
      if(users?.items) {
        console.log(users);
        this.usersData = users.items;
        this.userDataLength = users.total_count;
      }
    });
  }
}