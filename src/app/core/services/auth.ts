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
    return this.http.post('http://localhost:3000/auth/signup', data);
  }
}
