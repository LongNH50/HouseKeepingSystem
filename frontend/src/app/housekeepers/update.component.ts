import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HousekeepersService, IHousekeeper } from './housekeepers.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent {
  private houseKeeperService = inject(HousekeepersService);
  private notification = inject(ToastrService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  form = inject(NonNullableFormBuilder).group({
    _id: '',
    name: ['', Validators.required],
    email: ['', Validators.required],
    year_of_experience: [0, Validators.required],
    phone_number: ['', Validators.required],
    hourly_rate: [0, Validators.required],
    availability: [true, Validators.required],
    address: inject(NonNullableFormBuilder).group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      location: [[0, 1], Validators.required],
    }),
  });

  constructor() {
    const houseKeeper_id = this.activatedRoute.snapshot.paramMap.get(
      'houseKeeper_id'
    ) as string;
    this.houseKeeperService
      .getHousekeeperByID(houseKeeper_id)
      .subscribe((response) => {
        const {
          _id,
          name,
          email,
          year_of_experience,
          phone_number,
          hourly_rate,
          address,
          availability,
        } = response.data;
        if (response.success) {
          this.form.get('_id')?.patchValue(_id);
          this.form.get('name')?.patchValue(name);
          this.form.get('email')?.patchValue(email);
          this.form.get('year_of_experience')?.patchValue(year_of_experience);
          this.form.get('phone_number')?.patchValue(phone_number);
          this.form.get('hourly_rate')?.patchValue(hourly_rate);
          this.form.get('address')?.patchValue(address);
          this.form.get('availability')?.patchValue(availability);
        }
      });
  }
  submit() {
    this.houseKeeperService
      .updateHousekeeper(this.form.value as IHousekeeper)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success(
            'House Keeper edited successfully.',
            'Success'
          );
          console.log(this.notification);
          this.router.navigate(['', 'housekeepers']);
        }
      });
  }
  cancel() {
    this.router.navigate(['', 'housekeepers']);
  }
}
