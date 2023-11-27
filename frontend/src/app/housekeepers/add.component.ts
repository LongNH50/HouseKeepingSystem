import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HousekeepersService, IHousekeeper } from './housekeepers.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent {
  isAdded = false;
  private housekeeperService = inject(HousekeepersService);
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
    address: this.formBuilder.nonNullable.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      location: [[0, 1], Validators.required],
    }),
    availability: [false, Validators.required],
    hourly_rate: [0, Validators.required],
    year_of_experience: [0, Validators.required],
    language: ['', Validators.required],
    /*contract_details: this.formBuilder.nonNullable.group({
      house_owner_id: ['', Validators.required],
      house_owner_name: ['', Validators.required],
      start_date:[new Date(), Validators.required],
      end_date: [new Date(), Validators.required],
      total_price: [0, Validators.required],
    })*/
  });

  submit() {
    this.housekeeperService
      .addHousekeeper(this.form.value as IHousekeeper)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success(
            'House Keeper added successfully.',
            'Success'
          );
          this.isAdded = true;
          setTimeout(() => {
            this.router.navigate(['', 'housekeepers']);
          }, 3000);
        }
      });
  }
  cancel() {
    this.router.navigate(['', 'housekeepers']);
  }
}
