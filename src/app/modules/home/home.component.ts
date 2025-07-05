import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { DialogFormReservationComponent } from './dialog-form-reservation/dialog-form-reservation.component';

@Component({
  standalone: true,
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
    MatDialogModule,

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
  capacityControl = new FormControl();
  dateRange: any = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  typesSpace: TypeSpace[] = [];
  spaces: Space[] = [];
  spacesFilter: any = [];
  gridCols = 3;

  readonly dialog = inject(MatDialog);

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    this.getSpaces();
    this.getTypesSpace();
  }

  ngOnInit() {
    this.generalService.showToast("Cargando Informacion..", '', 4000);
    this.getSpaces();
    this.getTypesSpace();

    this.typeSpaceControl.valueChanges.subscribe((value) => {
      if (value != null || value !== '') {
        this.spacesFilter = this.spaces.filter((space: any) => value == space.typeSpace);
      }
    });

    this.capacityControl.valueChanges.subscribe((value: any) => {
      console.log(value)
      if (value != null || value !== '') {
        this.spacesFilter = this.spaces.filter((space: any) => value > Number(space.capacity));
      }
    });

    // Filtro por rango de fechas
    this.dateRange.valueChanges.subscribe((value: any) => {
      const { start, end } = value;

      if (start && end) {
        // Filtrar por fechas
        this.spacesFilter = this.spaces.filter((space: any) => {
          const schedules = JSON.parse(space.schedules);
          console.log("schedules", schedules)
          return schedules.some((schedule: any) => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate >= start && scheduleDate <= end;
          });
        });
      } else {
        this.spacesFilter = [...this.spaces];
      }
    });

    this.authUser = this.authService.getDataUser();
  }

  getTypesSpace() {
    this.generalService.getTypesSpaceldJson().subscribe({
      next: (response: any) => {
        if (response.member) {
          this.typesSpace = response.member;
        }

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

      this.spaces = this.spaces.filter(item => {
        let schedule = this.decodeSchedules(item.schedules);
        console.log(schedule);
        
        return schedule.some((scheduleItem: any) => scheduleItem.available === false);
      });
        this.spacesFilter = this.spaces;
        console.log('Espacios:', this.spaces);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al obtener los espacios:', error);
        this.generalService.showToast('Error al cargar los espacios', 'error');
      }
    });
  }

  cleanFilter() {
    this.spacesFilter = this.spaces;
    this.typeSpaceControl.reset('');
    this.capacityControl.reset(1);
    this.dateRange.reset({
      start: null,
      end: null
    });
    this.cdr.detectChanges();
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  showPhotos(photos: any) {
    try {
      const fileArray = JSON.parse(photos);
      return fileArray;
    } catch (error) {
      return [];
    }
  }
  
  decodeSchedules(schedules: any) {
    try {
      const dataArray = JSON.parse(schedules);
      return dataArray;
    } catch (error) {
      return [];
    }
  }

  reserveSpace(space: any) {
    console.log('Detalles del espacio:', space);

    const dialogRef = this.dialog.open(DialogFormReservationComponent, {
      width: '80%',
      height: '70vh',
      panelClass: 'custom-dialog',
      data: { space: space, user: this.authUser },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });

  }
}