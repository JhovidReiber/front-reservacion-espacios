import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';
import { GeneralService } from '../../core/services/general.service';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import esLocale from '@fullcalendar/core/locales/es';
import moment from 'moment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DialogDetailsReservationComponent } from './dialog-details-reservation/dialog-details-reservation.component';
import { EventClickArg } from '@fullcalendar/core/index.js';
import { LoadingComponent } from '../../shared/components/Loading/Loading.component';


@Component({
  standalone: true,
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCard,
    FullCalendarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    LoadingComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyReservationsComponent implements OnInit {

  authUser: any;
  authService = inject(AuthService);
  generalService = inject(GeneralService);

  calendarOptions: any;
  reservations: any;
  eventsFullCalendar: any;

  readonly dialog = inject(MatDialog);

  loading = false;
  constructor(
    private cdr: ChangeDetectorRef
  ) {
    this.authUser = this.authService.getDataUser();
    this.getMyReservations();
  }

  ngOnInit() {

    this.calendarOptions = {
      locale: esLocale,
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      events: [],
      eventClick: this.showReservation.bind(this),
      eventTextColor: 'black',
    };
  }

  getMyReservations() {
    this.loading = true;
    try {
      this.generalService.getMyReservation(this.authUser.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.length > 0) {
          this.reservations = response;
          console.log("this.reservations", this.reservations);


          // Preprocesar los eventos para FullCalendar
          const fullCalendarEvents = this.reservations.flatMap((item: any) => {
            // Aplanar el array de `schedules` para poder mapear cada evento individualmente
            return item.schedules.map((schedule: any) => {
              return {
                title: item.name_event,
                start: moment(`${schedule.date} ${schedule.startTime}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                end: moment(`${schedule.date} ${schedule.endTime}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                extendedProps: {
                  space: item.space,
                  id: item.id,
                  dataInfo: {
                    start: moment(`${schedule.date} ${schedule.startTime}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                    end: moment(`${schedule.date} ${schedule.endTime}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                    title: item.name_event,
                  },
                }
              };
            });
          });

          this.eventsFullCalendar = fullCalendarEvents;

          this.calendarOptions.events = this.eventsFullCalendar

        };
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error al obtener los espacios:', error);
        this.generalService.showToast('Error al cargar los espacios', 'error');
      }
    });
    } catch (error) {
      this.loading = false;
    }
  }

  showReservation(sclickInfo: EventClickArg) {

    let space = sclickInfo.event.extendedProps['space'];
    let dataInfo = sclickInfo.event.extendedProps['dataInfo'];
    let id = sclickInfo.event.extendedProps['id'];
    console.log('Detalles del espacio:', space);

    const dialogRef = this.dialog.open(DialogDetailsReservationComponent, {
      width: '80%',
      height: '70vh',
      panelClass: 'custom-dialog',
      data: {
        space: space,
        user: this.authUser,
        dataInfo: dataInfo,
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
      this.getMyReservations();
    });
  }


}
