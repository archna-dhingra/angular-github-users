import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../shared/user.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userId: string;
  userDetails = {
    userData: {},
    userRepos: []
  };
  tabsList = [];
  selectedType = 'All';
  selectedLanguage = 'All';
  repositorySeachQuery: string = '';
  repositoryCount: number = 0;

  @ViewChild('tabs') tabGroup: MatTabGroup;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = params['id'];
        this.userService.fetchUserDetails(this.userId).subscribe(([userData, userRepos]) => {
          this.userDetails.userData = userData;
          this.userDetails.userRepos = this.modifyRepositoriesData(userRepos);
          this.tabsList.push({title: 'Overview'});
          this.tabsList.push({title: 'Repositories', count: userData.public_repos});
          this.tabsList.push({title: 'Projects'});
          this.tabsList.push({title: 'Stars'});
          this.tabsList.push({title: 'Followers', count: userData.followers});
          this.tabsList.push({title: 'Following', count: userData.following});
          this.tabGroup.selectedIndex = 1;
        });
    });
  }

  getDate(dateString: string): string {
    var dateObj = new Date(dateString);
    return dateObj.toDateString().substring(4);
  }

  modifyRepositoriesData(userRepos) {
    let repos = userRepos.map(repository => {
      repository.lastUpdatedOn = this.getDate(repository.updated_at);
      return repository;
    });
    return repos;
  }

  searchRepository() {
    if(this.repositorySeachQuery !== '') {
      this.userService.fetchSearchedRepository(this.userId, this.repositorySeachQuery).subscribe(repositories => {
        if(repositories.items) {
          this.repositoryCount = repositories.total_count;
          this.userDetails.userRepos = this.modifyRepositoriesData(repositories.items);
        }
      });
    }
    else {
      this.userService.fetchAllRepositories(this.userId).subscribe(repositories => {
        this.userDetails.userRepos = this.modifyRepositoriesData(repositories);
      });
    }
  }

  resetSearchQuery() {
    this.repositorySeachQuery = '';
    this.searchRepository();
  }
}