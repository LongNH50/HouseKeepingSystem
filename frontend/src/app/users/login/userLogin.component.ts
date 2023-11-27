import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { IUser, UsersService } from '../users.service';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-login',
  templateUrl: './userLogin.component.html',
  styleUrls: ['./userLogin.component.css'],
})
export class UserLoginComponent {
  private usersService = inject(UsersService);
  private router = inject(Router);
  private notification = inject(ToastrService);
  private stateService = inject(StateService);
  private subscription!: Subscription;
  errorMessage!: any;

  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {
    this.subscription = this.stateService.getState().subscribe((state) => {
      if (state._id) {
        this.router.navigate(['', 'users']);
      }
    });
  }

  login() {
    this.usersService.login(this.form.value as IUser).subscribe((response) => {
      if (response.success) {
        this.notification.success('Successfully login.');
        const encrypted_token = response.data;
        const decoded_token = jwt_decode(encrypted_token) as IUser;
        const state = {
          ...decoded_token,
          jwt: encrypted_token,
          isAdmin: false,
        };
        this.stateService.setState(state);
        localStorage.setItem('APP_STATE', JSON.stringify(state));
        // console.log(state);
        this.router.navigate(['', 'housekeepers']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
