import { Injectable } from '@angular/core';
import {EnvironmentService} from "../environment/environment.service";
import {BaseEntity} from "./base-entity";
import * as THREE from "three";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LightService {
  counter: {[id: string] : number} = {};
  constructor(private environmentService: EnvironmentService) { }

  generatePointLight(x: number, y: number, z: number, target: THREE.Vector3 | null = null, color: number) {
    this.increaseCounter('point');
    const light = new THREE.PointLight(0xffffff, 10, 0, 0.5)
    light.color = new THREE.Color(color);
    light.position.set(x, y, z)
    light.lookAt(target || new THREE.Vector3(0, 0, 0));
    this.addGUI(light, 'point');
    return light;
  }

  generateSpotLight(x: number, y: number, z: number, target: THREE.Vector3) {
    this.increaseCounter('spot');
    const light = new THREE.SpotLight(0xffffff, 10, 0, 0.5)
    light.position.set(x, y, z)
    light.lookAt(new THREE.Vector3(target.x, 0, target.z));
    this.addGUI(light, 'spot');
    return light;
  }

  generateAmbientLight(x: number, y: number, z: number, color: number = 0x12172a) {
    if(!this.counter['ambient']) this.counter['point'] = 0;
    this.increaseCounter('ambient')
    const light = new THREE.AmbientLight(color, 0.5)
    light.position.set(x, y, z)
    light.color = new THREE.Color(color);
    this.addGUI(light, 'ambient');
    return light;
  }

  generateDirectionalLight(x: number, y: number, z: number, target: THREE.Vector3 | null = null) {
    if(!this.counter['directional']) this.counter['directional'] = 0;
    this.increaseCounter('directional')
    const light = new THREE.DirectionalLight(0xffffff, 0.5)
    light.position.set(x, y, z)
    light.lookAt(target || new THREE.Vector3(0, 0, 0));
    this.addGUI(light, 'directional');
    return light;
  }

  increaseCounter(id: string) {
    if(!this.counter[id]) this.counter[id] = 0;
    this.counter[id]++;
  }

  addGUI(instance: THREE.PointLight | THREE.AmbientLight | THREE.DirectionalLight | THREE.SpotLight, name: string ) {
    if(environment.production) return;
    const folder = this.environmentService.gui.addFolder(name + " light " + this.counter[name]);
    const data = {
        color: instance.color.getHex()
    }
    instance.add(new THREE.AxesHelper(1));
    folder.add(instance.position, 'x', -10, 10);
    folder.add(instance.position, 'y', -10, 10);
    folder.add(instance.position, 'z', -10, 10);
    folder.add(instance.rotation, 'x', 0, Math.PI * 2);
    folder.add(instance.rotation, 'y', 0, Math.PI * 2);
    folder.add(instance.rotation, 'z', 0, Math.PI * 2);
    folder.add(instance.scale, 'x', 0, 10);
    folder.add(instance.scale, 'y', 0, 10);
    folder.add(instance.scale, 'z', 0, 10);
    if(instance instanceof THREE.PointLight) {
      folder.add(instance, 'decay', 0, 10);
      folder.add(instance, 'distance', 0, 500);
    }
      folder.addColor(data, 'color').onChange(() => {
        instance.color.setHex(data.color)
      });

    folder.add(instance, 'intensity', 0, 30);
  }
}
