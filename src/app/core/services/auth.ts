import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  http = inject(HttpClient);
  login(data: any) {
    return this.http.post('auth/login', data);
  }

  signup(data: any) {
    return this.http.post('auth/signup', data);
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
