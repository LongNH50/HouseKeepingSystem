import { Component, inject } from '@angular/core';
import { HousekeepersService, IHousekeeper } from './housekeepers.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StateService } from '../state.service';

@Component({
  selector: 'app-list',
  // template: `
  //   <p>House Keeper List </p>
  //   <button (click)="gotoAdd()"> Add new House Keeper </button>
  //   <ul>
  //     <li *ngFor="let houseKeeper of houseKeepers">
  //       {{ houseKeeper.name }}
  //     </li>
  //   </ul>

  // `
  templateUrl: './list.component.html',
})
export class ListComponent {
  private houseKeeperService = inject(HousekeepersService);
  private notification = inject(ToastrService);
  private router = inject(Router);
  private stateService = inject(StateService);
  houseKeepers!: IHousekeeper[];
  houseKeepersFromDB!: IHousekeeper[];
  searchValue!: string;
  pages!: number[];
  current_page!: number;
  page_start!: number;
  pagination_size!: number;

  constructor() {
    this.page_start = 1;
    this.pagination_size = 3;
    this.setPages();
    this.getHousekeepers(1);
  }

  getHousekeepers(page: number) {
    this.houseKeeperService.getHousekeepers(page).subscribe((response) => {
      if (response.success) {
        this.houseKeepers = response.data;
        this.houseKeepersFromDB = response.data;
      }
    });
  }

  setPages() {
    this.pages = [];
    for (
      var i = this.page_start;
      i <= this.page_start + this.pagination_size;
      i++
    ) {
      this.pages.push(i);
    }
  }

  gotoPage(page: number) {
    if (page < 1) return;
    this.current_page = page;
    this.getHousekeepers(this.current_page);
    if (this.current_page < this.page_start) {
      this.page_start = this.current_page;
      this.setPages();
    }
    if (this.current_page > this.page_start + this.pagination_size) {
      this.page_start = this.page_start + 1;
      this.setPages();
    }
  }

  onSearchChange(event: any) {
    this.searchValue = event.target.value;
    this.search();
  }

  search() {
    this.houseKeepers = this.houseKeepersFromDB.filter(
      (i) =>
        i.name.toUpperCase().includes(this.searchValue.toUpperCase()) ||
        i.email.toUpperCase().includes(this.searchValue.toUpperCase()) ||
        i.hourly_rate.toString().includes(this.searchValue) ||
        i.year_of_experience.toString().includes(this.searchValue)
    );
  }

  gotoAdd() {
    this.router.navigate(['', 'housekeepers', 'add']);
  }

  gotoUpdate(housekeeper: IHousekeeper) {
    console.log(housekeeper._id);
    this.router.navigate(['', 'housekeepers', 'update', housekeeper._id]);
  }

  delete(houseKeeper_id: string) {
    if (confirm('Are you sure to delete')) {
      this.houseKeeperService
        .removeHousekeeper(houseKeeper_id)
        .subscribe((response) => {
          if (response.success) {
            this.notification.success(`Deleted`);
            this.houseKeepers = this.houseKeepers.filter(
              (response) => response._id != houseKeeper_id
            );
          }
        });
    }
  }

  gotoBook(housekeeper: IHousekeeper) {
    if (this.stateService.isLoggedIn()) {
      this.router.navigate(['', 'housekeepers', 'booking', housekeeper]);
    } else {
      this.router.navigate(['', 'user']);
    }
  }

  isDisabledBooking(housekeeper: IHousekeeper): boolean {
    return !housekeeper.availability;
  }

  isAdmin() {
    return this.stateService.isAdmin();
  }

  goToInfomation(houseKeeper_id: string) {
    this.router.navigate(['', 'housekeepers', houseKeeper_id]);
  }
}