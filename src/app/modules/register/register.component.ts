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

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,

    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    NgOptimizedImage,
  ],
})
export class RegisterComponent {

  form!: FormGroup;
  isLoading = false;

  authService = inject(AuthService);
  generalService = inject(GeneralService);

  constructor() {
    const fb = inject(FormBuilder);
    this.form = fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['ROL_USUARIO']
    });
  }

  ngOnInit(): void {
    this.form.reset();
    this.form.get('role')?.setValue('ROL_USUARIO');
  }

  register() {

    if (this.form.invalid) {
      this.generalService.showToast("Debe completar todos los campos", 'error');
      return;
    }

    this.isLoading = true;
    this.generalService.registerUser(this.form.value)
      .then(() => {
        this.isLoading = false;
        this.form.reset();
        this.form.get('username')?.setErrors(null);
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  checkUserNameExists() {
    const username = this.form.get('username')?.value;
    if (!username) {
      this.generalService.showToast("Debe completar el nombre de usuario", 'error');
      return;
    }

    this.generalService.checkUserNameExists(username)
      .then(exists => {
        if (exists) {
          this.generalService.showToast("El nombre de usuario ya existe", 'error');
          this.form.get('username')?.setErrors({ 'exists': true });
        } else {
          this.generalService.showToast("El nombre de usuario está disponible", 'success');
          this.form.get('username')?.setErrors(null);
        }
      })
      .catch(() => {
        this.generalService.showToast("Error al verificar el nombre de usuario", 'error');
      });
  }

  checkPasswordStrength() {
    const password = this.form.get('password')?.value;
    if (!password) {
      this.generalService.showToast("Debe completar la contraseña", 'error');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      this.form.get('password')?.setErrors(null);
    } else {
      this.form.get('password')?.setErrors({ 'passwordWeak': true });
      this.generalService.showToast("La contraseña debe contener al menos una letra, un número y un símbolo especial", 'error');
    }
  }

}
