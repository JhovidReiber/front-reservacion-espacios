import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
     { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
