import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Space } from '../models/Space';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);


  constructor() { }

  showToast(msg: string, type: string = '', duration:any = 5000) {
    this._snackBar.open(msg, 'Cerrar', {
      duration: duration,
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
  const headers = new HttpHeaders();  // Crea un encabezado vacío, sin incluir el JWT

  return this.http.post(`${environment.apiUrl}/check-username`, { username }, { headers })
    .toPromise()
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

  getSpaces() {
    return this.http.get(`${environment.apiUrl}/spaces`);
  }

  getSpacesldJson(page: number = 1, pageSize: number = 5) {
    return this.http.get(`${environment.apiUrl}/spaces?page=${page}&itemsPerPage=${pageSize}`, {
      headers: {
        Accept: 'application/ld+json'
      }
    });
  }

  createSpace(space: Space) {
    return this.http.post(`${environment.apiUrl}/spaces`, space).toPromise()
      .then(response => {
        this.showToast('Espacio creado exitosamente', 'success');
        return response;
      })
      .catch(error => {
        this.showToast(`Error al creado el espacio, ${error.message}`, 'error');
        throw error;
      });
  }

  editSpace(space: Space, id: any) {
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

  createReservation(reservation: any) {

    console.log(reservation, "enviada")
    return this.http.post(`${environment.apiUrl}/reservations`, reservation).toPromise()
      .then(response => {
        console.log('Respuesta del servidor:', response);
        this.showToast('Reserva realizada exitosamente', 'success');
        return response;
      })
      .catch(error => {
        console.error('Error en la petición:', error);
        this.showToast(`Error al crear la Reserva, ${error.message}`, 'error');
        throw error;
      });
  }

  deleteReservation(id: any) {
    return this.http.delete(`${environment.apiUrl}/reservations/${id}`).toPromise()
      .then(response => {
        this.showToast('Reserva eliminada exitosamente', 'success');
        return response;
      })
      .catch(error => {
        this.showToast(`Error al eliminar la reserva, ${error.message}`, 'error');
        throw error;
      });
  }

  getMyReservation(userId:any){
    return this.http.post(`${environment.apiUrl}/user/reservations`, { userId:userId });
  }
}
