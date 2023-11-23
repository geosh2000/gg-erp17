import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./common/login/login.component'),
  },
  {
    path: 'admin',
    canActivate: [ authGuard ],
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./dashboard/pages/dashboard/dashboard.component'),
      },
      {
        path:'', redirectTo: 'home', pathMatch: 'full',
      }
    ]
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  }
];
