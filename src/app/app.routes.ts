import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent) } ,
  { path: 'register', loadComponent: () => import('./modules/register/register.component').then(m => m.RegisterComponent) },
  { path: 'home', loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent), canActivate: [AuthGuard] },
  { path: 'spaces', loadComponent: () => import('./modules/spaces/spaces.component').then(m => m.SpacesComponent), canActivate: [AuthGuard] },
  { path: 'my-reservations', loadComponent: () => import('./modules/my-reservations/my-reservations.component').then(m => m.MyReservationsComponent), canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
