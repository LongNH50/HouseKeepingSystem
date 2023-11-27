import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { UserUpdateComponent } from './update/userUpdate.component';
import { UserComponent } from './user/user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserSignupComponent } from './signup/userSignup.component';
import { UserLoginComponent } from './login/userLogin.component';
import { StateService } from '../state.service';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    ListComponent,
    UserUpdateComponent,
    UserComponent,
    UserSignupComponent,
    UserLoginComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridModule,
    RouterModule.forChild([
       { path: '', component: ListComponent },
      // { path: 'login', component: UserLoginComponent },
      { path: 'signup', component: UserSignupComponent },
      {
        path: 'update/:user_id',
        component: UserUpdateComponent,
        canActivate: [() => inject(StateService).isLoggedIn()],
      },
      {
        path: ':user_id',
        component: UserComponent,
        canActivate: [() => inject(StateService).isLoggedIn()],
      },
    ]),
  ],
})
export class UsersModule {}
