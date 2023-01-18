import { Component } from '@angular/core';
import {HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import newMessageDTO from "./interfaces/newMessageDTO";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Chatter';
  name: string = 'John Doe';
  pwd: string = '17Simsi17';
  message: string = "Hello World";

  isAdmin: boolean = false;

  constructor() {
  }

  HubCon: any;

  public messages: newMessageDTO[] = [];


  ngOnInit() {
    this.HubCon = new HubConnectionBuilder()
      .withUrl("http://localhost:5261/chat")
      .build();

    this.connect();

    this.HubCon.on('newMessage', (name: string, message: string, timestamp: string) => {
      console.log("newMessage", name, message, timestamp);
      this.messages.push({name: name, message: message, timestamp: timestamp});
    });

    this.HubCon.on('clientConnected', (name: string) => {
      console.log("ClientConnected", name);
      this.messages.push({name: name, message: "Client connected", timestamp: new Date().toISOString()  });
    });
  }

  private connect() {
    this.HubCon.start().then(() => {
      console.log("Connected");
    }).catch((err: any) => {
      console.log(err);
    });
  }

  public get isConnected(): boolean {
    return this.HubCon.state === HubConnectionState.Connected;
  }

  signIn() {
    this.HubCon.invoke('signIn', this.name, this.pwd)
      .then((x:boolean) => {
        console.log("signIn", x);
        this.isAdmin = x;
      })
      .catch((err: any) => {
      console.log(err);
    });
  }

  signOut() {

  }

  send() {
    //{name: "anelle",  message: this.message, timestamp: new Date()}
    this.HubCon.invoke('newMessage', this.name, this.message, new Date().toISOString()).catch((err: any) => {
      console.log(err);
    });
  }
}
