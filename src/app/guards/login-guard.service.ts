import { Injectable } from '@angular/core';
import {Router, CanActivate, CanActivateChild, CanDeactivate} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private router: Router) { }
  // Validar los permisos de los usuarios
  canActivate(): boolean {
    const token = localStorage.getItem('currentUser');
    if (token == null) {
      return true;
    }
    if (!token) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}
