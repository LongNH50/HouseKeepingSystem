import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HousekeepersService {
  private http = inject(HttpClient);
  private page_size = 4;

  getHousekeepers(page: number) {
    return this.http.get<{ success: true; data: IHousekeeper[] }>(
      environment.HTTP_SERVER + '/houseKeepers?page=' + page + '&page_size='+this.page_size
    );
  }

  getHousekeeperByID(houseKeeper_id: string) {
    return this.http.get<{ success: true; data: IHousekeeper }>(
      environment.HTTP_SERVER + '/houseKeepers/' + houseKeeper_id
    );
  }

  addHousekeeper(housekeeper: IHousekeeper) {
    return this.http.post<{ success: true; data: IHousekeeper[] }>(
      environment.HTTP_SERVER + '/houseKeepers',
      housekeeper
    );
  }

  removeHousekeeper(houseKeeper_id: string) {
    return this.http.delete<{ success: true; data: IHousekeeper[] }>(
      environment.HTTP_SERVER + '/houseKeepers/' + houseKeeper_id
    );
  }

  updateHousekeeper(housekeeper: IHousekeeper) {
    return this.http.patch<{ success: true; data: IHousekeeper[] }>(
      environment.HTTP_SERVER + '/houseKeepers/' + housekeeper._id,
      housekeeper
    );
  }
}

export interface IHousekeeper {
  _id: string;
  admin_id: string;
  name: string;
  phone_number: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    location: [number];
  };
  availability: boolean;
  hourly_rate: number;
  year_of_experience: number;
  language: string;
  contract_details: [
    {
      house_owner_id: string;
      house_owner_name: string;
      start_date: Date;
      end_date: Date;
      total_price: number;
    }
  ];
}
