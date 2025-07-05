import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private currentUserSubject: BehaviorSubject<any>;
  private http = inject(HttpClient);

  constructor() {
    const token = this.getToken();
    // Emite el token si existe
    this.currentUserSubject = new BehaviorSubject<any>(token ? { token } : null);
  }

  // Hacer login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * @author David Reinoso<jhojandavid01@gmail.com>
   * @description Guarda el token en localStorage y actualiza el BehaviorSubject con el nuevo
   * @param token
   */
  setToken(token: string): void {
    localStorage.setItem('authJwt', token);
    this.currentUserSubject.next(token);
  }

  /**
   * @author David Reinoso<jhojandavid01@gmail.com>
   * @description Obtiene el token JWT almacenado en localStorage
   * @return string | null 
   */
  getToken(): string | null {
    return localStorage.getItem('authJwt');
  }

  /**
   * @author David Reinoso<jhojandavid01@gmail.com>
   * @description Elimina el token JWT del localStorage, actualiza el BehaviorSubject y cierra la sesión
   */
  logout(): void {
    localStorage.removeItem('authJwt');
    this.currentUserSubject.next(null);
  }

  // Verificar si está autenticado
  /**
   * @author David Reinoso<jhojandavid01@gmail.com>
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Obtiene el valor del usuario actual
  /**
   * @author David Reinoso<jhojandavid01@gmail.com>
   */
  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Verifica si el token es valido
  /**
   * @author David Reinoso<jhojandavid01@gmail.com>
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeJwt(token);
    return payload && payload.exp > Date.now() / 1000;
  }

  // Decodifica el JWT
  decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }


   get isAuthenticated$(): Observable<boolean> {
    const token = this.getToken() ?? '';
    if (!token) {
      return of(false);
    }
    return of(this.isTokenValid());
  }

  getDataUser(): any {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeJwt(token);
    return payload ? payload : null;
  }
}
