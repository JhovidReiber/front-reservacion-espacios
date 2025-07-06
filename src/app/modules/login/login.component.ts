import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GeneralService } from '../../core/services/general.service';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RegisterComponent } from '../register/register.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    RegisterComponent,

    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTabsModule,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  form: FormGroup;
  isLoading = false;

  authService = inject(AuthService);
  generalService = inject(GeneralService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.isTokenValid()) {
      this.router.navigate(['/home']);
    }
    this.form.reset();
  }

  login() {
    if (this.form.invalid) {
      this.generalService.showToast("Debo completar todos los campos", 'error');
      return;
    }
    this.isLoading = true;

    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe(
      (response) => {
        console.log("response", response);
        this.authService.setToken(response.token);
        this.router.navigate(['/home']);
        this.generalService.showToast('¡Inicio de sesión exitoso!', 'success');
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error de inicio de sesión:', error);
        this.generalService.showToast('Credenciales incorrectas', 'error');
      }
    );
  }
}
