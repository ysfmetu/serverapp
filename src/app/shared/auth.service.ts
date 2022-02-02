import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUserModel } from '../models/client.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  get token(): string {
    return sessionStorage.getItem('token');
  }

  get user(): LoggedUserModel {
    let logged: LoggedUserModel = JSON.parse(
      sessionStorage.getItem('userInfo')
    );
    return logged;
  }
  get role(): string {
    return this.user.role;
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    this.router.navigate(['']);
  }
  loginSuccess(dt: any) {
    console.log(dt.token);
    sessionStorage.setItem('token', dt.token);
    sessionStorage.setItem('userInfo', JSON.stringify(dt.info));

    this.router.navigate(['/kategori']);
  }
  get authenticated(): boolean {
    return this.token != undefined;
  }
}
