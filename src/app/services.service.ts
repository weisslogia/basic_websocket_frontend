import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  login(user) {
    return this.http.post(`${environment.API_BASE_PATH}/login`, user);
  }

  getUserById(userId) {
    return this.http.get(`${environment.API_BASE_PATH}/user/${userId}`);
  }

  getConnectedUsers() {
    return this.http.get(`${environment.API_BASE_PATH}/user/connected`);
  }
  getMessages() {
    return this.http.get(`${environment.API_BASE_PATH}/message`);
  }
}
