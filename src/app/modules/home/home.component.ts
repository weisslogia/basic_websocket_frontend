import { environment } from './../../../environments/environment';
import { ServicesService } from './../../services.service';
import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name = '';
  socket;
  users = [];
  messages = [];
  previous = null;
  selected = null;
  constructor(private services: ServicesService, private snackBar: MatSnackBar) { }

  async ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.name = currentUser.user.name;
    const connectedusers: any = await this.services.getConnectedUsers().toPromise();
    connectedusers.forEach(item => {
      this.users.push(item);
    });
    this.users = connectedusers;
    console.log(connectedusers);
    const messages: any = await this.services.getMessages().toPromise();
    for (let i = 0; i < messages.length; i++ ) {
      const message = messages[i];
      let sender;
      let resiver;
      if (message.sender) {
        sender = await this.services.getUserById(message.sender).toPromise();
        message.sender = sender.name;
      }
      if (message.resiver) {
        resiver = await this.services.getUserById(message.resiver).toPromise();
        message.resiver = resiver.name;
      }
      if (message.type === 3) {
        message.message = JSON.parse(message.message);
      }
    }
    this.messages = messages;
    this.socket = io(environment.API_BASE_PATH, {
      query: {
        access_token: currentUser.token,
        type: 'not defined',
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 15000
      },
    });
    this.socket.on('newUser', (data) => {
      this.users.push(data);
      this.snackBar.open(`New user connected ${data.name}`, 'close', {
        duration: 2000,
      });
    });
    this.socket.on('disconnectedUser', (data) => {
      const usr = [];
      this.users.forEach(user => {
        if (user.token !== data) {
          usr.push(user);
        } else {
          this.snackBar.open(`${user.name} disconected`, 'close', {
            duration: 2000,
          });
        }
      });
      this.users = usr;
    });
    this.socket.on('message-diffusion', async (message) => {
      let sender;
      if (message.sender) {
        sender = await this.services.getUserById(message.sender).toPromise();
        message.sender = sender.name;
      }
      if (message.sender) {
        message.sender = 'Server';
      }
      this.messages.push(message);
      setTimeout(() => {
        const div = document.getElementById('scrollAble');
        div.scrollTop = div.scrollHeight;
      }, 50);
      this.snackBar.open(`New diffusion message from ${message.sender}`, 'close', {
        duration: 2000,
      });
    });

    this.socket.on('message-diffusion-json', async (message) => {
      message.message = JSON.parse(message.message);
      this.snackBar.open(`New diffusion message from ${message.sender}`, 'close', {
        duration: 2000,
      });
      this.messages.push(message);
      setTimeout(() => {
        const div = document.getElementById('scrollAble');
        div.scrollTop = div.scrollHeight;
      }, 50);
      console.log(message);
    });

    this.socket.on('message-to', async (message) => {
      let sender;
      if (message.sender) {
        sender = await this.services.getUserById(message.sender).toPromise();
        message.sender = sender.name;
      }
      this.messages.push(message);
      setTimeout(() => {
        const div = document.getElementById('scrollAble');
        div.scrollTop = div.scrollHeight;
      }, 50);
      this.snackBar.open(`New private message from ${message.sender}`, 'close', {
        duration: 2000,
      });
    });
  }

  diffusion(message) {
    this.socket.emit('message-diffusion', message.value);
  }

  messageHandler(message) {
    if (this.previous) {
      this.socket.emit('message-to', {message: message.value, reciver: this.previous});
      this.messages.push({
        sender: this.name,
        type: 1,
        message: message.value
      })
    } else {
      this.snackBar.open(`You must select one user`, 'close', {
        duration: 2000,
      });
    }
  }

  select(id) {
    if (this.previous) {
      const prev = document.getElementById(this.previous);
      prev.classList.toggle('selected');
    }
    const element = document.getElementById(id);
    element.classList.toggle('selected');
    this.previous = id;
  }

}
