import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser, UsersService } from '../users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './userSignup.component.html',
  styleUrls: ['./userSignup.component.css'],
})
export class UserSignupComponent {
  private usersService = inject(UsersService);
  private notification = inject(ToastrService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    phone_number: [
      '',
      [Validators.required, Validators.pattern(/^\+?\d{10,14}$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    address: this.formBuilder.nonNullable.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      location: [[0, 1], Validators.required],
    }),
    /*contract_details: this.formBuilder.nonNullable.group({
      house_owner_id: ['', Validators.required],
      house_owner_name: ['', Validators.required],
      start_date:[new Date(), Validators.required],
      end_date: [new Date(), Validators.required],
      total_price: [0, Validators.required],
    })*/
  });

  signup() {
    this.usersService.signup(this.form.value as IUser).subscribe((response) => {
      console.log(response.success);
      if (response.success) {
        this.notification.success('Successfully Signed Up.');
        this.router.navigate(['', 'user']);
      }
    });
  }
}
