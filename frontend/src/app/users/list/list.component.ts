import { Component, inject } from '@angular/core';
import { UsersService, IUser } from '../users.service';
import { Router } from '@angular/router';
import { StateService } from '../../state.service';
import { HousekeepersService, IHousekeeper } from 'src/app/housekeepers/housekeepers.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  private userService = inject(UsersService);
  private houseKeeperService = inject(HousekeepersService);
  private router = inject(Router);
  users!: IUser[];
  houseKeepers!: IHousekeeper[];
  houseKeepersFromDB!: IHousekeeper[];
  searchValue!: string;
  user!: IUser;
  isVisible = false;
  pages!: number[];
  current_page!: number;
  page_start!: number;
  pagination_size!: number;


  private stateService = inject(StateService)

  columnDefs = [
    { headerName: 'Start Date', field: 'start_date' },
    { headerName: 'End Date', field: 'end_date' },
    { headerName: 'Total Price', field: 'total_price' }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  constructor() {
    if (this.stateService.isAdmin()) {
      this.getUsers();
    } else {
      this.getUser();
    }

    this.page_start = 1;
    this.pagination_size = 3;
    this.setPages();
    this.getAllHouseKeepers(1);
  }

  setPages() {
    this.pages = [];
    for (var i = this.page_start; i <= this.page_start + this.pagination_size; i++) {
      this.pages.push(i);
    }
  }

  gotoPage(page: number) {
    if (page < 1) return;
    this.current_page = page;
    this.getAllHouseKeepers(this.current_page);
    if (this.current_page < this.page_start) {
      this.page_start = this.current_page;
      this.setPages();
    }
    if (this.current_page > this.page_start + this.pagination_size) {
      this.page_start = this.page_start + 1;
      this.setPages();
    }

  }

  getUsers() {
    this.userService.getUsers().subscribe((response) => {
      if (response.success) {
        this.users = response.data;
      }
    });
  }

  getUser() {
    this.userService.getUserByID(this.stateService.getId()).subscribe(response => {
      if (response.success) {
        this.user = response.data;
      }
    })
  }

  getAllHouseKeepers(page: number) {
    this.houseKeeperService.getHousekeepers(page).subscribe(response => {
      if (response.success) {
        let hkIds = this.user.contract_details.map(i => i.house_keeper_id);
        this.houseKeepers = response.data.filter(item => hkIds.includes(item._id));
        
        this.houseKeepersFromDB = this.houseKeepers;
        this.isVisible = true;
      }
    })
  }

  gotoAdd() {
    this.router.navigate(['', 'users', 'add']);
  }

  gotoUpdate(user: IUser) {
    this.router.navigate(['', 'users', 'update', user._id], {
      state: { user },
    });
  }

  onSearchChange(event: any) {
    this.searchValue = event.target.value;
    this.search();
  }

  search() {
    this.houseKeepers = this.houseKeepersFromDB.filter(
      i => i.name.toUpperCase().includes(this.searchValue.toUpperCase()) ||
        i.email.toUpperCase().includes(this.searchValue.toUpperCase()) ||
        i.hourly_rate.toString().includes(this.searchValue) ||
        i.year_of_experience.toString().includes(this.searchValue)
    )
  }
}
