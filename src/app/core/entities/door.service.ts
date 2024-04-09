import { Injectable } from '@angular/core';
import {EnvironmentService} from "../environment/environment.service";
import {BaseEntity} from "./base-entity";
import * as THREE from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OBB} from "three/examples/jsm/math/OBB";
// @ts-ignore
import {Text} from 'troika-three-text'
import {LightService} from "./light.service";
import {environment} from "../../../environments/environment";

export class Door
{
  entity: BaseEntity;
  link: string;
  header: string;
    constructor(link: string, header: string) {
        this.entity = new BaseEntity();
        this.link = link;
        this.header = header;
    }
}

@Injectable({
  providedIn: 'root'
})
export class DoorService {
  counter = 0;
  constructor(private environmentService: EnvironmentService, private lightService: LightService) { }

  async generate(link: string, header: string, range = 100) {
    console.log("Generating Door")
    this.counter++;
    const progressBar = this.environmentService.progressBar;
    const progressLabel = this.environmentService.progressLabel;
    let door = new Door(link, header);

    const fbxLoader = new FBXLoader();
    await fbxLoader.loadAsync(`/assets/characters/door.fbx`, (xhr) => {
      this.updateProgress(progressBar, progressLabel, xhr, `Loading door: `);
    }).then((object: any) => {
      object.scale.set(0.02, 0.02, 0.02);
      door.entity.mesh = object;
      door.entity.mesh.position.set((Math.random() * range) - range, 2, (Math.random() * range) - range);
      const doorText = new Text();
      doorText.text = door.header;
      doorText.fontSize = 1;
      doorText.position.y = 6;
      doorText.position.x = door.entity.mesh.position.x - 1;
      doorText.position.z = door.entity.mesh.position.z;
      doorText.color = 0xffffff;
      let light1 = this.lightService.generateSpotLight(door.entity.mesh.position.x, 0, door.entity.mesh.position.z, door.entity.mesh.position);
      door.entity.mesh.add(doorText);
      this.environmentService.scene.add(doorText);
      this.environmentService.scene.add(light1);
      this.environmentService.scene.add(door.entity.mesh);
    });



    this.addGUI(door.entity);
    return door;
  }

  updateProgress(progressBar: HTMLProgressElement, progressLabel: HTMLHeadingElement, xhr: any, message: string) {
    if (xhr.lengthComputable) {
      progressBar.value = (xhr.loaded / xhr.total) * 100
      progressBar.style.display = 'block'
      progressLabel.style.display = 'block'
      progressLabel.innerHTML = message + Math.floor(progressBar.value) + '%'
    }
  }

  addGUI(instance: BaseEntity) {
    if(environment.production) return;
    const folder = this.environmentService.gui.addFolder('Door ' + this.counter);
    folder.add(instance.mesh.position, 'x', -10, 10);
    folder.add(instance.mesh.position, 'y', -10, 10);
    folder.add(instance.mesh.position, 'z', -10, 10);
    folder.add(instance.mesh.rotation, 'x', 0, Math.PI * 2);
    folder.add(instance.mesh.rotation, 'y', 0, Math.PI * 2);
    folder.add(instance.mesh.rotation, 'z', 0, Math.PI * 2);
    folder.add(instance.mesh.scale, 'x', 0, 10);
    folder.add(instance.mesh.scale, 'y', 0, 10);
    folder.add(instance.mesh.scale, 'z', 0, 10);
  }
}
