import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private server : string = "ws://192.168.100.155:7070/calbania";
  private socket : WebSocket = new WebSocket(this.server);

  constructor(){}

  public onConnected(callback) : void {
    this.socket.onopen = (event : Event) => {
      callback(event);
    }
  }

  public onMessage(callback) : void {
    this.socket.onmessage = (event : Event) => {
      callback(event);
    }
  }

  public onError(callback) : void {
    this.socket.onerror = (event : Event) => {
      callback(event);
    }
  }

  public send(message : any) {
    this.socket.send(JSON.stringify(message));
  }
}
