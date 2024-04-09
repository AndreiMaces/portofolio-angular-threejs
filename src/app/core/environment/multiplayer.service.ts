import { Injectable } from '@angular/core';
import {Socket} from "socket.io-client";
import { io } from 'socket.io-client'
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import {ThirdPersonService} from "../entities/controls/third-person.service";
import {EnvironmentService} from "./environment.service";
import {Character, CharacterService} from "../entities/character.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MultiplayerService {
  socket: Socket;
  myId: any;
  clientCharacters: { [id: string]: Character } = {}
  constructor(
      private thirdPersonControlsService: ThirdPersonService,
      private environmentService: EnvironmentService,
      private characterService: CharacterService
  ) {}

  async initialize(): Promise<void> {
    this.connect();
    this.registerToMultiplayer(this.thirdPersonControlsService.player);
    await this.subscribeToMultiplayer(this.environmentService.scene);
  }

    connect() {
      this.socket = io(environment.url);
      this.socket.on('connect', function () {
        console.log('connect')
      });
    }

    registerToMultiplayer(character: Character): void
    {
      this.socket.on('id', (id: any) => {
        this.myId = id;
        setInterval(() => {
          this.socket.emit('update', {
            t: Date.now(),
            p: character.mesh.position,
            r: character.mesh.rotation,
            action: character.currentActionIndex(),
            name: character.name,
            scale: character.scale,
            color: character.color
          })
        }, 50)
      })
    }

  async subscribeToMultiplayer(scene: THREE.Scene): Promise<void> {
    let isLoading = false;
    this.socket.on('users', async (clients: any) => {
      for(let p of Object.keys(clients)) {
        if(p == this.myId || isLoading || !clients[p].color) continue;
        if (!this?.clientCharacters[p]) {
          isLoading = true;
          this.clientCharacters[p] = (await this.characterService.generate(clients[p].name, clients[p].scale, clients[p].color));
          console.log(clients[p])
          isLoading = false;
          this.clientCharacters[p].mesh.name = p;
          scene.add(this?.clientCharacters[p]?.mesh);
        } else if (this.clientCharacters[p]) {
          if (clients[p].p) {
            new TWEEN.Tween(this.clientCharacters[p].mesh.position)
                .to(clients[p].p, 50)
                .start();
          }
          if (clients[p].r) {
            this.clientCharacters[p].mesh.rotation.set(clients[p].r._x, clients[p].r._y, clients[p].r._z);
          }
          if(clients[p].action) {
            this.clientCharacters[p].setAction(this.clientCharacters[p].animationActions[clients[p].action])
          }
        }
      }
    });
    this.socket.on('removeClient', (id: string) => {
      scene.remove(scene.getObjectByName(id) as THREE.Object3D)
    })

  }
}
