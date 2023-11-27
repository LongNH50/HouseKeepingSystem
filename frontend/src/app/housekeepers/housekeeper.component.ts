import { Component, inject } from '@angular/core';
import { HousekeepersService, IHousekeeper } from './housekeepers.service';
import { Subscription } from 'rxjs';
import { IState, StateService } from '../state.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-housekeeper',
  templateUrl: `./housekeeper.component.html`,
  styleUrls: ['./housekeeper.component.css'],
})
export class HousekeeperComponent {
  private houseKeeperService = inject(HousekeepersService);
  private subscription!: Subscription;
  private stateService = inject(StateService);
  private activatedRoute = inject(ActivatedRoute);
  houseKeeper!: IHousekeeper;
  state!: IState;
  private router = inject(Router);
  isVisible = false;

  constructor() {
    const houseKeeper_id = this.activatedRoute.snapshot.paramMap.get(
      'houseKeeper_id'
    ) as string;

    this.subscription = this.stateService.getState().subscribe((state) => {
      this.state = state;
    });

    this.houseKeeperService
      .getHousekeeperByID(houseKeeper_id)
      .subscribe((response) => {
        if (response.success) {
          this.houseKeeper = response.data;
          this.isVisible = true;
          console.log(this.houseKeeper);
        }
      });
  }

  isAdmin() {
    return this.stateService.isAdmin();
  }

  delete(houseKeeper_id: string) {
    if (confirm('Are you sure to delete')) {
      this.houseKeeperService.removeHousekeeper(houseKeeper_id);
      this.router.navigate(['', 'housekeepers']);
    }
  }

  gotoUpdate(housekeeper: IHousekeeper) {
    console.log(housekeeper._id);
    this.router.navigate(['', 'housekeepers', 'update', housekeeper._id]);
  }

  gotoBook(housekeeper: IHousekeeper) {
    if (this.stateService.isLoggedIn()) {
      this.router.navigate(['', 'housekeepers', 'booking', housekeeper]);
    } else {
      this.router.navigate(['', 'user']);
    }
  }
}
