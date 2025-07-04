import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, Type, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../core/services/auth.service';
import { GeneralService } from '../../core/services/general.service';
import { TypeSpace } from '../../core/models/TypeSpace';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Space } from '../../core/models/Space';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { DialogFormSpacesComponent } from './dialog-form-spaces/dialog-form-spaces.component';

@Component({
  standalone: true,
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCard,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpacesComponent implements OnInit {

  authUser: any;
  authService = inject(AuthService);
  generalService = inject(GeneralService);
  spaces: Space[] = [];
  typesSpace: TypeSpace[] = [];

  newSpace: { name: string; description: string } = { name: '', description: '' };
  displayedColumns: string[] = ['name', 'description', 'capacity', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);

  photosSpace!:any;

  constructor() { }

  ngOnInit() {
    this.getSpaces();
    this.getTypesSpace();
    this.authUser = this.authService.getDataUser();
  }



  getSpaces() {
    this.generalService.getSpaces().subscribe({
      next: (response: any) => {
        this.spaces = response;
        this.dataSource = new MatTableDataSource(this.spaces);
        this.dataSource.paginator = this.paginator;

        console.log('Espacios obtenidos:', this.spaces, this.dataSource);
      },
      error: (error: any) => {
        console.error('Error al obtener los espacios:', error);
        this.generalService.showToast('Error al cargar los espacios', 'error');
      }
    });
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


  showDetalle(space: Space | null, type: string) {
    console.log('Detalles del espacio:', space);

    const dialogRef = this.dialog.open(DialogFormSpacesComponent, {
      data: {
        space: space,
        type: type,
        typesSpace: this.typesSpace
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });

  }

  showPhotos(photos: any) {
    try {
      const fileArray = JSON.parse(photos);
      console.log(fileArray);
      this.photosSpace = fileArray;
    } catch (error) {
      this.photosSpace = null;
    }
  }

}
