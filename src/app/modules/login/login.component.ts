import { Router } from '@angular/router';
import { ServicesService } from './../../services.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private services: ServicesService, private router: Router) { }

  ngOnInit() {
  }

  async login(username) {
    try {
      const dataLogin = await this.services.login({ name: username.value }).toPromise();
      localStorage.setItem('currentUser', JSON.stringify(dataLogin));
      this.router.navigate(['home']);
    } catch (er) {

    }

  }

}
