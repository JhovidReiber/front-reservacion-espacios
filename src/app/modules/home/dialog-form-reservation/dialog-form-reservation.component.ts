import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogFormSpacesComponent } from '../../spaces/dialog-form-spaces/dialog-form-spaces.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { GeneralService } from '../../../core/services/general.service';



@Component({
  standalone: true,
  selector: 'app-dialog-form-reservation',
  templateUrl: './dialog-form-reservation.component.html',
  styleUrls: ['./dialog-form-reservation.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTimepickerModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class DialogFormReservationComponent implements OnInit {

  data = inject(MAT_DIALOG_DATA);
  generalService = inject(GeneralService);
  space = this.data.space;
  user = this.data.user;


  scheduleForm!: FormGroup;
  scheduleData: any = [];
  availableTimes: string[] = []
  fechasDisponibles: Date[] = [];
  today = new Date();


  constructor(
    private dialogRef: MatDialogRef<DialogFormSpacesComponent>,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

    this.today.setHours(0, 0, 0, 0);
    this.scheduleForm = this.fb.group({
      selectedDate: [null, Validators.required],
      selectedTime: [null, Validators.required],
      eventName: ['', Validators.required],
    });

    if (this.space.schedules) {
      this.scheduleData = this.decodeSchedules(this.space.schedules);
      console.log("this.scheduleData", this.scheduleData);

      const fechasDisponibles = this.scheduleData
        .filter((item: any) => item.available == false)
        .map((item: any) => {
          const date = new Date(item.date);
          return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        })
        .filter((fecha: any) => fecha >= this.today);

      this.fechasDisponibles = fechasDisponibles;
      console.log(this.fechasDisponibles);
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    console.log("date", date)
    const selectedDateString = date.toISOString().split('T')[0];
    console.log('Fecha seleccionada:', selectedDateString);

    return this.scheduleData.some((schedule: any) => {
      const scheduleDateString = new Date(schedule.date).toISOString().split('T')[0];
      console.log('Fecha de schedule:', scheduleDateString);

      return selectedDateString == scheduleDateString;
    });
  };

  // Filtro para habilitar solo fechas del array
  filtrarFechasDisponibles = (d: Date | null): boolean => {
    if (!d) return false;

    return this.fechasDisponibles.some(fecha =>
      fecha.getDate() === d.getDate() &&
      fecha.getMonth() === d.getMonth() &&
      fecha.getFullYear() === d.getFullYear()
    );
  };

  // Filtrar las horas disponibles cuando se selecciona una fecha
  onDateChange(event: any): void {
    const selectedDate = event.value;
    this.availableTimes = this.getAvailableTimesForDate(selectedDate);
    this.scheduleForm.patchValue({ selectedTime: '' });
  }

  // Obtener las horas disponibles para la fecha seleccionada
  getAvailableTimesForDate(date: Date): string[] {
    const availableTimes: string[] = [];

    this.scheduleData.forEach((schedule: any) => {
      const scheduleDate = new Date(schedule.date);
      console.log("scheduleDate", scheduleDate)
      // Crear una nueva fecha con el mismo formato (solo año, mes y día)
      const scheduleDateOnly = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());
      const selectedDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Verificar si la fecha seleccionada coincide con la fecha de la programación
      if (scheduleDateOnly.getTime() === selectedDateOnly.getTime() && schedule.available == false) {
        availableTimes.push(schedule.startTime);
      }
    });

    console.log("availableTimes", availableTimes)
    return availableTimes;
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

  submitForm(): void {
    console.log(this.scheduleForm.value)
    if (this.scheduleForm.valid) {
      console.log('Fecha seleccionada:', this.scheduleForm.value.selectedDate);
      console.log('Hora seleccionada:', this.scheduleForm.value.selectedTime);

      let formData: any = {};
      formData.user = this.generateElementEntityId('users', this.user.id);
      formData.space = this.generateElementEntityId('spaces', this.space.id);
      formData.name_event = this.scheduleForm.value.eventName;
      formData.date_start = this.scheduleForm.value.selectedDate;
      formData.start_time = this.scheduleForm.value.selectedTime;
      formData.date_end = this.scheduleForm.value.selectedDate;

      this.generalService.createReservation(formData)
        .then(() => {
          this.scheduleForm.reset();
          this.close();
        })
        .catch(() => {
        });

    } else {
      console.log('Por favor, selecciona una fecha y hora válidas.');
    }
  }

  generateElementEntityId(entity: string, id: any) {
    return `/api/${entity}/${id}`;
  }

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
