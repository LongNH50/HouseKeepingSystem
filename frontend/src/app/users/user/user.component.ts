import { Component, inject } from '@angular/core';
import { IUser, UsersService } from '../users.service';
import { IState, StateService } from 'src/app/state.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  state!: IState;
  private userService = inject(UsersService);
  private stateService = inject(StateService);
  private formBuilder = inject(FormBuilder);
  private subscription!: Subscription;
  user!: IUser;
  isVisible = false;

  constructor() {
    this.subscription = this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
    this.userService.getUserByID(this.state._id).subscribe((response) => {
      if (response.success) {
        console.log(response.data)
        this.user = response.data;
        this.isVisible = true;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
