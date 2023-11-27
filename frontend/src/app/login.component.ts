import { Component, inject } from '@angular/core';
import { AdminService, IAdmin } from './admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { StateService } from './state.service';
import jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private notification = inject(ToastrService);
  private stateService = inject(StateService);
  private subscription!: Subscription;

  form = inject(FormBuilder).nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    this.subscription = this.stateService.getState().subscribe((state) => {
      if (state._id) {
        this.router.navigate(['', 'housekeepers']);
      }
    });
  }

  login() {
    this.adminService.login(this.form.value as IAdmin).subscribe((response) => {
      if (response.success) {
        this.notification.success('Successfully login.', 'Admin');
        const encrypted_token = response.data;
        const decoded_token = jwt_decode(encrypted_token) as IAdmin;
        const state = {
          ...decoded_token,
          jwt: encrypted_token,
          isAdmin: true,
        };
        this.stateService.setState(state);
        localStorage.setItem('APP_STATE', JSON.stringify(state));
        this.router.navigate(['', 'housekeepers']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
