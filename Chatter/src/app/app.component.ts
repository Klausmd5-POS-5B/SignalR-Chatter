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
  clientCount: number = 0;


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

    this.HubCon.on('clientDisconnected', (name: string) => {
      console.log("ClientDisconnected", name);
      this.messages.push({name: name, message: "Client disconnected", timestamp: new Date().toISOString()  });
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
    if(!this.isConnected) {
      this.connect();
    } else {
      this.HubCon.invoke('signIn', this.name, this.pwd)
        .then((x:boolean) => {
          console.log("signIn", x);
          this.isAdmin = x;

          if(this.isAdmin) {
            this.HubCon.on('nrClientsChanged', (nr: number) => {
              console.log("NrClientsChanged", nr);
              this.clientCount = nr;
              this.messages.push({name: "Sörver", message: "Client count: "+nr , timestamp: new Date().toISOString()  });
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  signOut() {
    this.HubCon.stop();
  }

  send() {
    //{name: "anelle",  message: this.message, timestamp: new Date()}
    this.HubCon.invoke('newMessage', this.name, this.message, new Date().toISOString()).catch((err: any) => {
      console.log(err);
    });
  }
}
