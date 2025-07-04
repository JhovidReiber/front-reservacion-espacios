import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Space } from '../models/Space';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);


  constructor() { }

  showToast(msg: string, type: string) {
    this._snackBar.open(msg, 'Cerrar', {
      duration: 9000,
      panelClass: [`snackbar-${type}`]
    });
  }

  registerUser(user: any) {
    return this.http.post(`${environment.apiUrl}/register`, user).toPromise()
      .then(response => {
        this.showToast('Usuario registrado exitosamente', 'success');
        return response;
      })
      .catch(error => {
        this.showToast(`Error al registrar usuario, ${error.message}`, 'error');
        throw error;
      });
  }

  checkUserNameExists(username: string) {
    return this.http.post(`${environment.apiUrl}/check-username`, { username }).toPromise()
      .then((response: any) => response.exists)
      .catch(error => {
        this.showToast(`Error al verificar el nombre de usuario, ${error.message}`, 'error');
        throw error;
      });
  }

  getTypesSpace() {
    return this.http.get(`${environment.apiUrl}/type_spaces`);
  }

   getTypesSpaceldJson() {
    return this.http.get(`${environment.apiUrl}/type_spaces`, {
      headers: {
        Accept: 'application/ld+json'
      }
    });
  }
  // Modulo de Espacios
  getSpaces() {
    return this.http.get(`${environment.apiUrl}/spaces`);
  }


  createSpace(space: Space) {
    return this.http.post(`${environment.apiUrl}/spaces`, space).toPromise()
      .then(response => {
        this.showToast('Espacio actualizado exitosamente', 'success');
        return response;
      })
      .catch(error => {
        this.showToast(`Error al actualizar el espacio, ${error.message}`, 'error');
        throw error;
      });
  }

  editSpace(space: Space, id:any) {
    return this.http.put(`${environment.apiUrl}/spaces/${id}`, space).toPromise()
      .then(response => {
        this.showToast('Espacio actualizado exitosamente', 'success');
        return response;
      })
      .catch(error => {
        this.showToast(`Error al actualizar el espacio, ${error.message}`, 'error');
        throw error;
      });
  }

  deleteSpace(space: Space) {
    return this.http.delete(`${environment.apiUrl}/spaces/${space.id}`).toPromise()
      .then(response => {
        this.showToast('Espacio eliminado exitosamente', 'success');
        return response;
      })
      .catch(error => {
        this.showToast(`Error al eliminar el espacio, ${error.message}`, 'error');
        throw error;
      });
  }



}
