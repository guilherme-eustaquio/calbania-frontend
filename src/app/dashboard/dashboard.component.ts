import { WebSocketService } from './../../shared/services/websocket.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public airships = {};
  public airshipsCommandsTimeout = {};
  public airshipsProperties = {};
  public toggle = {
    0: {
      src:'/assets/toggle_off.svg',
      color:'#4a4a4a'
    },
    1: {
      src:'/assets/toggle_on.svg',
      color:"white"
    }
  };

  constructor(private webSocketService : WebSocketService) {}

  ngOnInit(): void {

    this.webSocketService.onConnected((event : Event) => {
      console.log("connected on server.");
    });

    this.webSocketService.onMessage((event : Event) => {
      this.receiveCommand(event);
    });

    this.webSocketService.onError((event : Event) => {
      this.showError("Something wrong on airship's device connecting");
    });
  }

  public executeCommand(airship) : void {

    this.airshipsProperties[airship.id].loading = false;

    let airshipData = JSON.parse(JSON.stringify(airship));

    if(airshipData.status == 0) {
      this.showError("The airship is desactivated.");
      return;
    }

    airshipData.command.action = airshipData.command.action == 1 ? 0 : 1;
    this.webSocketService.send(airshipData);
    this.setTimeOutCommand(airshipData, 2000);
  }

  private clearTimeOutCommand(airship) {
    this.airshipsCommandsTimeout[airship.id] = -1;
  }

  private receiveCommand(event) : void {

    console.log(event.data);
    let object = JSON.parse(event.data);
    let updateState = 0;

    for(let key in object) {

      if(object[key].id == undefined) {
        updateState = 1;
        break;
      }

      this.airships[object[key].id] = object[key];
      this.toggleExecute(object[key]);
      this.clearTimeOutCommand(object[key]);
    }

    if(updateState) {
      this.airships[object.id] = object;
      this.toggleExecute(object);
      this.clearTimeOutCommand(object);
    }
  }

  private toggleExecute(airship) {
    if(!this.airshipsProperties[airship.id]) {
      this.airshipsProperties[airship.id] = {};
    }

    this.airshipsProperties[airship.id].src = this.toggle[airship.command.action].src;
    this.airshipsProperties[airship.id].color = this.toggle[airship.command.action].color;
    this.airshipsProperties[airship.id].loading = true;
  }

  private setTimeOutCommand(airship, timeout) {

    this.airshipsCommandsTimeout[airship.id] = new Date();

    setTimeout(() => {

      for(let key in this.airshipsCommandsTimeout) {
        if(this.airshipsCommandsTimeout[key] != -1 && Math.abs((new Date() as any) - this.airshipsCommandsTimeout[key]) >= timeout) {
          this.airshipsCommandsTimeout[key] = -1;
          this.showError(`Timeout for #<b>${airship.id}</b>... Verify if your airship's device is on`, () => {
            this.airshipsProperties[airship.id].loading = true;
          });
        }
      }

    }, timeout);
  }

  private showError(message : string, callback?) {
    $("#error-message-warn").fadeIn(300).delay(3000).fadeOut(3000, () => {
      if(callback) {
        callback();
      }
    });
    $("#error-message-warn").html(message);
  }
}
