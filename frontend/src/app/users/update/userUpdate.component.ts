import { Component, inject } from '@angular/core';
import { IUser, UsersService } from '../users.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update',
  templateUrl: './userUpdate.component.html',
  styleUrls: ['./userUpdate.component.css'],
})
export class UserUpdateComponent {
  private userService = inject(UsersService);
  private notification = inject(ToastrService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  form = inject(NonNullableFormBuilder).group({
    _id: '',
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone_number: [
      '',
      [Validators.required, Validators.pattern(/^\+?\d{10,14}$/)],
    ],
    address: inject(NonNullableFormBuilder).group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      location: [[0, 1], Validators.required],
    }),
  });

  constructor() {
    const user_id = this.activatedRoute.snapshot.paramMap.get(
      'user_id'
    ) as string;
    this.userService.getUserByID(user_id).subscribe((response) => {
      const { _id, name, email, phone_number, address } = response.data;
      if (response.success) {
        this.form.get('_id')?.patchValue(_id);
        this.form.get('name')?.patchValue(name);
        this.form.get('email')?.patchValue(email);
        this.form.get('phone_number')?.patchValue(phone_number);
        this.form.get('address')?.patchValue(address);
      }
    });
  }
  submit() {
    this.userService
      .updateUser(this.form.value as IUser)
      .subscribe((response) => {
        console.log(response.success);
        if (response.success) {
          this.notification.success('User edited successfully.', 'Success');
          console.log(this.notification);
          this.router.navigate(['', 'housekeepers']);
        }
      });
  }

  cancel() {
    this.router.navigate(['', 'housekeepers']);
  }
}
