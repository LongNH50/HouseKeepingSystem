import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService, IAdmin } from './admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  // template: `<p>Signup a new user!</p>
  //   <form [formGroup]="form" (ngSubmit)="signup()">
  //     <input placeholder="email" formControlName="email" />
  //     <input placeholder="name" formControlName="name" />
  //     <input
  //       placeholder="password"
  //       formControlName="password"
  //       type="password"
  //     />
  //     <button type="submit" [disabled]="!form.valid">Signup</button>
  //   </form> `,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private notification = inject(ToastrService);

  form = inject(FormBuilder).nonNullable.group({
    email: ['', Validators.required],
    name: ['', Validators.required],
    password: ['', Validators.required],
  });

  signup() {
    this.adminService
      .signup(this.form.value as IAdmin)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success('Successfully Signed Up.');
          this.router.navigate(['', 'login']);
        }
      });
  }
}
