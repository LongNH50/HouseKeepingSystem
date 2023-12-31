import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  private router = inject(Router);

  goToListHK() {
    this.router.navigate(['', 'housekeepers']);
  }
}
