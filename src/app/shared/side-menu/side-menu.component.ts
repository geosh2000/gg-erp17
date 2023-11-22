import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { RouterModule } from '@angular/router';
import { DashboardService } from '@shared/dashboard.service';
import { LoginService } from '../../common/login.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  public _dash = inject(DashboardService)
  public _login = inject(LoginService);

  menuItems = routes
    .map( route => route.children ?? [] )
    .flat()
    .filter( route => route && route.path )
    .filter( route => !route.path?.includes(':') )




}
