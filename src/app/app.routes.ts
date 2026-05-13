import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },

  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard-module').then((m) => m.DashboardModule),
  },
];
