import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, CanDeactivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  // Validar los permisos de los usuarios
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // const roles = route.data['roles'] as Array<string>;
    const token = localStorage.getItem('currentUser');
    if (token == null) {
      this.router.navigate(['login']);
      return false;
    }
    if (!token) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
