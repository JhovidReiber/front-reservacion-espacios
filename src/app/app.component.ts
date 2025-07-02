import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { MatTabsModule } from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, MatTabsModule, MatCardModule, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-reservacion-espacios';
}
