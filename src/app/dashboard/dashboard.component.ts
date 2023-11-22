import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { SideMenuComponent } from '@shared/side-menu/side-menu.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule, SideMenuComponent, NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent { }
