import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StateService } from './state.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AddTokenInterceptor } from './add-token.interceptor';
import { UserSignupComponent } from './users/signup/userSignup.component';
import { ListComponent } from './housekeepers/list.component';
import { UserLoginComponent } from './users/login/userLogin.component';
import { UserUpdateComponent } from './users/update/userUpdate.component';

function bootstrap(stateService: StateService) {
  return () => {
    const persisted_state = localStorage.getItem('APP_STATE');
    if (persisted_state) {
      stateService.setState(JSON.parse(persisted_state));
    } else {
    }
  };
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: HomepageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: UserSignupComponent },
      { path: 'user', component: UserLoginComponent },
      // { path: 'update', component: UserUpdateComponent },
      {
        path: 'housekeepers',
        loadChildren: () =>
          import('./housekeepers/housekeepers.module').then(
            (module) => module.HousekeepersModule
          ),
        // canActivate: [() => inject(StateService).isLoggedIn()],
      },

      {
        path: 'users',
        // component: UserSignupComponent,
        loadChildren: () =>
          import('./users/users.module').then((module) => module.UsersModule),
        // canActivate: [() => inject(StateService).isLoggedIn()],
      },
      { path: '**', redirectTo: 'signin' },
    ]),
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: bootstrap,
      deps: [StateService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AddTokenInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
