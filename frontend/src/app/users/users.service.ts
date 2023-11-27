import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IHousekeeper } from '../housekeepers/housekeepers.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  login(data: IUser) {
    return this.http.post<{ success: true; data: string }>(
      environment.HTTP_SERVER + '/users/login',
      data
    );
  }

  signup(data: IUser) {
    return this.http.post<{ success: true; data: IUser }>(
      environment.HTTP_SERVER + '/users/signup',
      data
    );
  }

  getUsers() {
    return this.http.get<{ success: true; data: IUser[] }>(
      environment.HTTP_SERVER + '/users'
    );
  }

  getUserByID(user_id: string) {
    return this.http.get<{ success: true; data: IUser }>(
      environment.HTTP_SERVER + '/users/' + user_id
    );
  }

  addUser(user: IUser) {
    return this.http.post<{ success: true; data: IUser[] }>(
      environment.HTTP_SERVER + '/users',
      user
    );
  }

  removeUser(user_id: string) {
    return this.http.delete<{ success: true; data: IUser[] }>(
      environment.HTTP_SERVER + '/users/' + user_id
    );
  }

  updateUser(user: IUser) {
    return this.http.patch<{ success: true; data: IUser[] }>(
      environment.HTTP_SERVER + '/users/' + user._id,
      user
    );
  }

  booking(contract_detail: object, userId: string) {
    return this.http.patch<{ success: true; data: string }>(
      environment.HTTP_SERVER + '/users/' + userId + '/booking',
      contract_detail
    );
  }
}

export interface IUser {
  _id: string;
  name: string;
  phone_number: string;
  email: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    location: [number];
  };
  contract_details: [
    {
      house_keeper_id: string;
      house_keeper_name: string;
      start_date: Date;
      end_date: Date;
      total_price: number;
    }
  ];
}
