import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';


import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, MatCardModule, CommonModule, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  menus = [
    { label: 'Home', route: '/home', icon: 'fas fa-home', role: ['ROL_USUARIO', 'ROL_ADMIN'] },
    { label: 'Espacios', route: '/spaces', icon: 'fa-solid fa-map-location-dot', role: ['ROL_ADMIN'] },
    { label: 'Mis Reservas', route: '/my-reservations', icon: 'fa-solid fa-bookmark', role: ['ROL_USUARIO', 'ROL_ADMIN'] },
  ];
  activeLink = this.menus[0];

  isAuthenticated: boolean = false;
  authService = inject(AuthService);
  authUser: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        let token: string = this.authService.getToken() ?? '';
        const decodeJwt = this.authService.decodeJwt(token);
        this.authUser = decodeJwt;
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (this.authService.isAuthenticated() && this.authService.isTokenValid()) {
        let token: string = this.authService.getToken() ?? '';
        const decodeJwt = this.authService.decodeJwt(token);
        this.authUser = decodeJwt;
        this.isAuthenticated = true;
      }

      const currentMenu = this.menus.find(menu => event.urlAfterRedirects.startsWith(menu.route));
      if (currentMenu) {
        this.activeLink = currentMenu;
      }
      console.log('Redirigido a:', event.urlAfterRedirects);
    });
  }

  hasRole(menuRoles: string[]): boolean {
    return menuRoles.some(role => this.authUser.roles.includes(role));
  }

  cerrarSesion() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.authUser = null;
    this.activeLink = this.menus[0];
    this.router.navigate(['/login']);
  }
}
