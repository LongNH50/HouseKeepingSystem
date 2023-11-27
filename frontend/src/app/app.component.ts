import { Component, inject } from '@angular/core';
import { IState, StateService, initial_state } from './state.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <!-- <p>Welcome {{ state._id }}</p>
    <button *ngIf="state._id; else howsignbuttons" (click)="signOut()">
      Signout
    </button>

    <ng-template #howsignbuttons>
      <button (click)="gotoSignup()">SignUp</button>
      <button (click)="gotoLogin()">Login</button>
    </ng-template> -->
    <router-outlet />
    <app-footer></app-footer>
  `,
  styles: [],
})
export class AppComponent {
  state!: IState;

  private subscription!: Subscription;
  private stateService = inject(StateService);
  private router = inject(Router);

  constructor() {
    this.subscription = this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  gotoLogin() {
    this.router.navigate(['', 'login']);
  }

  signOut() {
    this.stateService.setState(initial_state);
    localStorage.clear();
    this.router.navigate(['', 'login']);
  }

  gotoSignup() {
    this.router.navigate(['', 'signup']);
  }
}
