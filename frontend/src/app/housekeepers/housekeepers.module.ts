import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { AddComponent } from './add.component';
import { UpdateComponent } from './update.component';
import { HousekeeperComponent } from './housekeeper.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingComponent } from './booking.component';
import { StateService } from '../state.service';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    UpdateComponent,
    HousekeeperComponent,
    BookingComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ListComponent },
      {
        path: 'add',
        component: AddComponent,
        canActivate: [() => inject(StateService).isLoggedIn()],
      },
      {
        path: 'booking',
        component: BookingComponent,
        canActivate: [() => inject(StateService).isLoggedIn()],
      },
      {
        path: 'update/:houseKeeper_id',
        component: UpdateComponent,
        canActivate: [() => inject(StateService).isLoggedIn()],
      },
      { path: ':houseKeeper_id', component: HousekeeperComponent },
    ]),
  ],
})
export class HousekeepersModule {}
