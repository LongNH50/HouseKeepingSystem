import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _state = new BehaviorSubject<IState>(initial_state);

  getState() {
    return this._state.asObservable();
  }

  setState(new_state: IState) {
    this._state.next(new_state);
    return this._state.value;
  }

  isLoggedIn() {
    return this._state.value._id ? true : false;
  }

  getToken() {
    return this._state.value.jwt;
  }

  getId() {
    return this._state.value._id;
  }
  isAdmin() {
    return this._state.value.isAdmin;
  }
}

export interface IState {
  _id: string;
  name: string;
  email: string;
  jwt: string;
  isAdmin: boolean;
}

export const initial_state = {
  _id: '',
  name: 'Admin',
  email: '',
  jwt: '',
  isAdmin: false,
};
