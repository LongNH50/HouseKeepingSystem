import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { IHousekeeper } from './housekeepers.service';
import { ToastrService } from 'ngx-toastr';
import { IState, StateService } from '../state.service';
import { UsersService } from '../users/users.service';
import { HousekeepersService } from './housekeepers.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  isAdded = false;
  isInValidDate = false;
  invalidDate = 'Invalid Date!!!. End Date must greater than Start Date';
  invalidDateInContract = "";
  errorMessage = '';

  private activeRouter = inject(ActivatedRoute);
  private stateService = inject(StateService);
  private houseKeeper!: IHousekeeper;
  private userService = inject(UsersService);
  private notification = inject(ToastrService);
  private houseKeeperService = inject(HousekeepersService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private state!: IState;
  private startDate!: Date;
  private endDate!: Date;
  private totalDays!: number;
  private totalPrice!: number;

  sub = this.activeRouter.params.subscribe((param: any) => {
    this.houseKeeper = param;
  });

  constructor() {
    this.houseKeeperService
      .getHousekeeperByID(this.houseKeeper._id)
      .subscribe((response) => {
        if (response.success) {
          this.houseKeeper = response.data;
        }
      });
  }

  ss = this.stateService.getState().subscribe((response) => {
    this.state = response;
  });

  form = this.formBuilder.nonNullable.group({
    _id: this.houseKeeper._id,
    name: [this.houseKeeper.name],
    phone_number: [this.houseKeeper.phone_number],
    email: [this.houseKeeper.email],
    address: this.formBuilder.nonNullable.group({
      street: [this.houseKeeper.address.street],
      city: [this.houseKeeper.address.city],
      state: [this.houseKeeper.address.state],
      zip: [this.houseKeeper.address.zip],
      location: [[0, 1], Validators.required],
    }),
    availability: [this.houseKeeper.availability],
    hourly_rate: [this.houseKeeper.hourly_rate],
    year_of_experience: [this.houseKeeper.year_of_experience],
    language: [this.houseKeeper.language],
    contract_details: this.formBuilder.nonNullable.group({
      house_owner_id: [this.state._id],
      house_owner_name: [this.state.name],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      total_price: [0],
    }),
  });

  onStartDateChange(event: any) {
    this.startDate = new Date(event.target.value);
    if (this.endDate) {
      this.calculateTotalDays();
    }
  }

  onEndDateChange(event: any) {
    this.endDate = new Date(event.target.value);
    if (this.endDate) {
      this.calculateTotalDays();
    }
  }

  calculateTotalDays() {
    const timeDifference = this.endDate.getTime() - this.startDate.getTime();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    this.totalDays = Math.floor(timeDifference / millisecondsPerDay);
    this.totalPrice = this.totalDays * this.houseKeeper.hourly_rate;
    if (this.totalPrice < 0){
      this.totalPrice = 0;
      this.errorMessage = this.invalidDate;
      this.isInValidDate = true;
    }else{
      this.errorMessage = '';
      this.isInValidDate = false;
    }
     
    this.form.get('contract_details.total_price')?.patchValue(this.totalPrice);
  }

  cancel() {
    this.router.navigate(['', 'housekeepers']);
  }

  submit() {
    if (this.validator()) {
      return;
    } else {
      let contract_detail = {
        house_keeper_id: this.houseKeeper._id,
        house_keeper_name: this.houseKeeper.name,
        start_date: this.startDate,
        end_date: this.endDate,
        total_price: this.totalPrice,
      };
      this.userService
        .booking(contract_detail, this.state._id)
        .subscribe((response) => {
          this.notification.success(
            'Book House Keeper successfully.',
            'Success'
          );
          this.isAdded = true;
          setTimeout(() => {
            this.router.navigate(['', 'users']);
          }, 3000);
        });
    }
  }

  validator() {
    if (this.totalPrice <= 0) {
      this.totalPrice = 0
      this.errorMessage =
      'Invalid Date!!!. End Date must greater than Start Date';
      this.isInValidDate = true;
      return true;
    }else if (this.houseKeeper.contract_details.length > 0) {
        const contract_detail = this.houseKeeper.contract_details.sort(function (
          a,
          b
        ) {
          let da = new Date(a.end_date);
          let db = new Date(b.end_date);
          return db.getTime() - da.getTime();
        })[0];
        let sDate = new Date(this.startDate);
        let eDate = new Date(contract_detail.end_date);
        if (sDate < eDate) {
          this.isInValidDate = true;
          let formatEndDate = new Intl.DateTimeFormat('en-US').format(eDate);
          this.errorMessage =
            'Invalid Date!!!. Start Date is greater than last End Date (' +
            formatEndDate +
            ') into Contract Details';
          return true;
        }
      }

      this.isInValidDate = false;
      this.errorMessage = '';
      return false;
    }
}
