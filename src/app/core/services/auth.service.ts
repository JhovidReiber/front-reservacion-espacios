import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;
  private currentUserSubject: BehaviorSubject<any>;
  private http = inject(HttpClient);

  constructor() {
    const token = localStorage.getItem('authJwt');
    this.currentUserSubject = new BehaviorSubject<any>(token);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('authJwt', token);
    this.currentUserSubject.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem('authJwt');
  }

  logout(): void {
    localStorage.removeItem('authJwt');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
}
