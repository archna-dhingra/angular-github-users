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

  @ViewChild('tabs') tabGroup: MatTabGroup;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = params['id'];
        this.userService.fetchUserDetails(this.userId).subscribe(([userData, userRepos]) => {
          this.userDetails.userData = userData;
          userRepos.map(repository => {
            repository.lastUpdatedOn = this.getDate(repository.updated_at);
          });
          this.userDetails.userRepos = userRepos;
          console.log(this.userDetails);
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
}