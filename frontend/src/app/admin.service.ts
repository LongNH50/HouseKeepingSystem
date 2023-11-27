
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient)

  login(data: IAdmin) {
    return this.http.post<{success: true, data: string}>(environment.HTTP_SERVER + '/admin/login', data)
  }

  signup(data: IAdmin) {
    return this.http.post<{success: true, data: IAdmin}>(environment.HTTP_SERVER + '/admin/signup', data)
  }
}

export interface IAdmin {
  _id: string,
  name: string,
  email: string,
  password: string
}
