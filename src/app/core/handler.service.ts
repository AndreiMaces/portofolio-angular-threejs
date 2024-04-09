import { Injectable } from '@angular/core';
import {EnvironmentService} from "./environment/environment.service";
import {TestCubeService} from "./entities/test-cube.service";
import {OrbitControlsService} from "./entities/controls/orbit-controls.service";
import {PointerLockControlsService} from "./entities/controls/pointer-lock-controls.service";
import {SkyService} from "./entities/backgrounds/sky.service";
import {FloorService} from "./entities/floor.service";
import {LightService} from "./entities/light.service";
import {CharacterService} from "./entities/character.service";
import TWEEN from '@tweenjs/tween.js'
import {Object3D, Vector3} from "three";
import {ThirdPersonService} from "./entities/controls/third-person.service";
import {MultiplayerService} from "./environment/multiplayer.service";
import {DoorService} from "./entities/door.service";

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  constructor(
    private environmentService: EnvironmentService,
    private thirdPersonControlsService: ThirdPersonService,
    private skyService: SkyService,
    private floorService: FloorService,
    private lightService: LightService,
    private characterService: CharacterService,
    private multiplayerService: MultiplayerService,
    private doorService: DoorService,
  ) {
  }

  async initialize() {
    console.log("Initializing handler service")
    this.environmentService.scene.add(this.skyService.generate());
    this.environmentService.scene.add(this.floorService.generate());
    this.environmentService.scene.add(this.lightService.generateAmbientLight(100, 10, 0));
    let door1 = await this.doorService.generate("https://macesandrei.com", "macesandrei.com");
    let door2 = await this.doorService.generate("https://yelpcamp.macesandrei.com", "yelpcamp.macesandrei.com");
    let door3 = await this.doorService.generate("https://catfact.macesandrei.com", "catfact.macesandrei.com");
    let door4 = await this.doorService.generate("https://bacxvia.macesandrei.com", "bacxvia.macesandrei.com");
    let door5 = await this.doorService.generate("https://rtmc.macesandrei.com", "rtmc.macesandrei.com");
    this.environmentService.addDoor(door1);
    this.environmentService.addDoor(door2);
    this.environmentService.addDoor(door3);
    this.environmentService.addDoor(door4);
    this.environmentService.addDoor(door5);
    let character = await this.characterService.generateRandom();
    this.environmentService.scene.add(character.mesh);
    this.thirdPersonControlsService.generate(character);
    await this.multiplayerService.initialize();
  }

  getAllObjects(): Object3D[] {
    return this.environmentService.scene.children;
  }
}
