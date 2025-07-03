import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../core/services/general.service';
import { TypeSpace } from '../../core/models/TypeSpace';
import { Space } from '../../core/models/Space';

import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCard,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,

    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  authUser: any;
  authService = inject(AuthService);
  generalService = inject(GeneralService);

  // Filtros
  typeSpaceControl = new FormControl('');
  capacityControl = new FormControl(1);
  dateRange: any = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  typesSpace: TypeSpace[] = [];
  spaces: Space[] = [];
  gridCols = 3; 


  constructor() { }

  ngOnInit() {
    this.getTypesSpace();
    this.getSpaces();

    let token: string = this.authService.getToken() ?? '';
    const decodeJwt = this.authService.decodeJwt(token);
    this.authUser = decodeJwt;

  }

  options = [
    { value: 'option1', viewValue: 'Opción 1' },
    { value: 'option2', viewValue: 'Opción 2' },
    { value: 'option3', viewValue: 'Opción 3' }
  ];

  logSelection() {
    console.log('Valor seleccionado:', this.typeSpaceControl.value);
  }

  getTypesSpace() {
    this.generalService.getTypesSpace().subscribe({
      next: (response: any) => {
        this.typesSpace = response;

        console.log('Tipos de espacio obtenidos:', this.typesSpace);
      },
      error: (error: any) => {
        console.error('Error al obtener los tipos de espacio:', error);
        this.generalService.showToast('Error al cargar los tipos de espacio', 'error');
      }
    });
  }

  getSpaces() {
    this.generalService.getSpaces().subscribe({
      next: (response: any) => {
        this.spaces = response;
        console.log('Espacios:', this.spaces);
        this.setGridCols();
    window.addEventListener('resize', () => this.setGridCols());
      },
      error: (error: any) => {
        console.error('Error al obtener los espacios:', error);
        this.generalService.showToast('Error al cargar los espacios', 'error');
      }
    });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  setGridCols() {
    const width = window.innerWidth;
    if (width < 600) {
      this.gridCols = 1;  // Una columna para pantallas pequeñas
    } else if (width < 900) {
      this.gridCols = 2;  // Dos columnas para pantallas medianas
    } else {
      this.gridCols = 3;  // Tres columnas para pantallas grandes
    }
  }

  reserveSpace(space: any) {
    console.log('Reserva para:', space.name);
    // Agregar lógica de reserva
  }

}
