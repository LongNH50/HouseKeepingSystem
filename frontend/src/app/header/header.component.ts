import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IState, StateService, initial_state } from '../state.service';
import { IUser, UsersService } from '../users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  state!: IState;
  private subscription!: Subscription;
  private stateService = inject(StateService);
  private userService = inject(UsersService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  users!: IUser[];

  constructor() {
    this.subscription = this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  gotoLogin() {
    this.router.navigate(['', 'login']);
  }
  gotoUserLogin() {
    // console.log(this.router.navigate(['', 'users', 'login']));
    this.router.navigate(['', 'user']);
  }
  signOut() {
    this.stateService.setState(initial_state);
    localStorage.clear();

    this.router.navigate(['', 'login']);
  }

  gotoSignup() {
    this.router.navigate(['', 'signup']);
  }
  gotoUpdateUser(user_id: string) {
    this.router.navigate(['', 'users', 'update', user_id]);
  }

  gotoDetailContract(user_id: string) {
    this.router.navigate(['', 'users']);
  }

  gotoUserInfo(user_id: string) {
    this.router.navigate(['', 'users', user_id]);
  }

  goToListHK() {
    this.router.navigate(['', 'housekeepers']);
  }

  isLoggined() {
    return this.stateService.isLoggedIn();
  }
  isAdmin() {
    return this.stateService.isAdmin();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
