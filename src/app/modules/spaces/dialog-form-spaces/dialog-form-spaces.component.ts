import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Space } from '../../../core/models/Space';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { GeneralService } from '../../../core/services/general.service';
import { TypeSpace } from '../../../core/models/TypeSpace';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { LoadingComponent } from '../../../shared/components/Loading/Loading.component';

@Component({
  standalone: true,
  selector: 'app-dialog-form-spaces',
  templateUrl: './dialog-form-spaces.component.html',
  styleUrls: ['./dialog-form-spaces.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTimepickerModule,
    LoadingComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFormSpacesComponent implements OnInit {


  authUser: any;
  authService = inject(AuthService);
  generalService = inject(GeneralService);

  data = inject(MAT_DIALOG_DATA);
  type = this.data.type;
  space = this.data.space;


  form!: FormGroup;
  isLoading = false;

  typesSpace: TypeSpace[] = this.data.typesSpace;
  showPhotosEdit: any;

  today: any;


  constructor(
    private dialogRef: MatDialogRef<DialogFormSpacesComponent>,
    private fb: FormBuilder
  ) {
    // const fb = inject(FormBuilder);
    this.today = new Date();
    this.form = fb.group({
      name: [this.type == 'edit' && this.space ? this.space.name : '', [Validators.required]],
      description: [this.type == 'edit' && this.space ? this.space.description : '', [Validators.required]],
      capacity: [this.type == 'edit' && this.space ? this.space.capacity : '', [Validators.required, Validators.min(1), Validators.max(100)]],
      typeSpace: [this.type == 'edit' && this.space ? this.space.typeSpace : '', [Validators.required]],
      photos: [null, this.type == 'create' ? Validators.required : null],
      schedules: this.fb.array(this.type == 'create' ? [this.createSchedule()] : [])
    });

    console.log(this.form, this.type === 'create' ? 'require' : [''])
  }

  ngOnInit() {
    if (this.type == 'edit') {
      if (this.space.photos) {
        let photos = this.decodePhotes(this.space.photos);
        if (photos.length > 0) this.form.patchValue({ photos: this.space.photos });
      }

      if (this.space.schedules) {
        let horarios = this.decodeSchedules(this.space.schedules);
        if (horarios != null && horarios != undefined) {
          if (horarios.length > 0) horarios.forEach((item: any) => this.schedules.push(this.createSchedule(item)));
        }
      }

    }
  }

  get schedules(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  createSchedule(data: any = null): FormGroup {
    console.log("entra");
    return this.fb.group({
      date: [data !== null ? data.date : '', Validators.required],
      startTime: [data !== null ? data.startTime : '', Validators.required],
      endTime: [data !== null ? data.endTime : '', Validators.required],
      available: [false],
    }, { validators: dateRangeValidator() });
  }

  addSchedule(): void {
    this.schedules.push(this.createSchedule());
  }

  removeSchedule(index: number): void {
    this.schedules.removeAt(index);
  }

  checkForDuplicateSchedules(): boolean {
    const schedules = this.form.get('schedules') as FormArray;

    for (let i = 0; i < schedules.length; i++) {
      const currentSchedule = schedules.at(i).value;

      const currentDate = new Date(currentSchedule.date).toISOString().split('T')[0];
      const currentStartTime = currentSchedule.startTime;
      const currentEndTime = currentSchedule.endTime;

      console.log("currentSchedule", currentDate, currentStartTime, currentEndTime);

      for (let j = i + 1; j < schedules.length; j++) {
        const nextSchedule = schedules.at(j).value;

        const nextDate = new Date(nextSchedule.date).toISOString().split('T')[0];
        const nextStartTime = nextSchedule.startTime;
        const nextEndTime = nextSchedule.endTime;

        // Comparamos si existe un horario con la misma fecha y el mismo rango de hora
        if (currentDate === nextDate &&
          currentStartTime === nextStartTime &&
          currentEndTime === nextEndTime) {
          return true;
        }
      }
    }

    return false;
  }

  onFilesChange(event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const MAX_SIZE_MB = 5;

    if (files && files.length > 0) {

      if (files.length > 5) {
        this.generalService.showToast("Solo se pueden cargar maximo 5 imagenes", 'error');
        this.form.patchValue({ photos: null });
        throw "";
      }
      const fileArray: any[] = [];

      Array.from(files).forEach((file) => {

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          alert(`El archivo "${file.name}" supera los ${MAX_SIZE_MB} MB permitidos.`);
          throw `El archivo "${file.name}" supera los ${MAX_SIZE_MB} MB permitidos.`;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          fileArray.push(e.target.result);


          if (fileArray.length === files.length) {
            const fileArrayAsText = JSON.stringify(fileArray);
            this.form.patchValue({ photos: fileArrayAsText });
          }
        };

        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.type)
    let formData = [];
    try {
      switch (this.type) {
        case 'create':
          if (this.form.invalid) {
            this.generalService.showToast("Debe completar todos los campos", 'error');
            this.isLoading = false;
            return;
          }
          if (this.checkForDuplicateSchedules()) {
            this.generalService.showToast("No se pueden agregar horarios duplicados", 'error');
            this.isLoading = false;
            return;
          }

          formData = this.form.value;
          let schedulesControl = this.form.controls['schedules'].value;
          console.log("schedulesControlEdit", schedulesControl)
          if (schedulesControl.length === schedulesControl.length) {
            const fileArrayAsText = JSON.stringify(schedulesControl); // convierto el array a un string json
            formData.schedules = fileArrayAsText;
          }
          console.log("FormData", formData);

          this.generalService.createSpace(this.form.value)
            .then(() => {
              this.isLoading = false;
              this.generalService.showToast('Espacio creado exitosamente', 'success');
              this.form.reset();
              this.close();
            })
            .catch(() => {
              this.isLoading = false;
            });

          break;
        case 'edit':
          if (this.form.invalid) {
            this.generalService.showToast("Debe completar todos los campos", 'error');
            this.isLoading = false;
            return;
          }
          if (this.checkForDuplicateSchedules()) {
            this.generalService.showToast("No se pueden agregar horarios duplicados", 'error');
            this.isLoading = false;
            return;
          }

          formData = this.form.value;
          let schedulesControlEdit = this.form.controls['schedules'].value;
          console.log("schedulesControlEdit", schedulesControlEdit)

          if (schedulesControlEdit.length === schedulesControlEdit.length) {
            const fileArrayAsText = JSON.stringify(schedulesControlEdit);
            formData.schedules = fileArrayAsText;
          }
          console.log("FormData", formData);

          this.generalService.editSpace(this.form.value, this.space?.id)
            .then(() => {
              this.generalService.showToast('Espacio actualizado exitosamente', 'success');
              this.isLoading = false;
              this.form.reset();
              this.close();
            })
            .catch(() => {
              this.isLoading = false;
            });

          break;
        case 'delete':
          this.generalService.deleteSpace(this.space)
            .then(() => {
              this.generalService.showToast('Espacio eliminado exitosamente', 'success');
              this.isLoading = false;
              this.form.reset();
              this.close();
            })
            .catch(() => {
              this.isLoading = false;
            });
          break;
        default:
          break;
      }
    } catch (error) {
      this.isLoading = false;
    }
    this.isLoading = false;
    console.log("Final ", this.form.value, this.form.controls['name'].value);
  }

  decodePhotes(photos: any) {
    try {
      const fileArray = JSON.parse(photos);
      return fileArray
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

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}


// Validador para comparar que la fecha de inicio sea menor que la fecha de fin
export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (startTime && endTime && startTime >= endTime) {
      return { 'invalidDateRange': 'La hora de inicio debe ser menor que la hora de fin' };
    }

    return null;
  };
}