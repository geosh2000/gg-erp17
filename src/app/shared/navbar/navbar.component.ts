import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '@shared/dashboard.service';
import { UserMenuComponent } from '@shared/user-menu/user-menu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, UserMenuComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public _dash = inject(DashboardService)

  toggleSidebar(){
    this._dash.sidebarVisible = !this._dash.sidebarVisible
  }

}
