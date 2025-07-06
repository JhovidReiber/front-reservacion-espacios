import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogFormSpacesComponent } from '../../spaces/dialog-form-spaces/dialog-form-spaces.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

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
  selector: 'app-dialog-details-reservation',
  templateUrl: './dialog-details-reservation.component.html',
  styleUrls: ['./dialog-details-reservation.component.css'],
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
    NgOptimizedImage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class DialogDetailsReservationComponent implements OnInit {

   dataDialog = inject(MAT_DIALOG_DATA);
    generalService = inject(GeneralService);
    space = this.dataDialog.space;
    user = this.dataDialog.user;
    dataInfo = this.dataDialog.dataInfo;

  constructor() { }

  ngOnInit() {
    console.log(this.space)
    console.log(this.user)
    console.log(this.dataInfo)
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

}
