import { Injectable } from '@angular/core';
import {EnvironmentService} from "../environment/environment.service";
import {BaseEntity} from "./base-entity";
import * as THREE from "three";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  constructor(private environmentService: EnvironmentService) { }

  generate() {
    console.log("Generating floor")
    const instance = new BaseEntity();
    instance.setGeometry(new THREE.PlaneGeometry());
    instance.setMaterial(new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide,}));
    instance.setMesh(new THREE.Mesh(instance.geometry, instance.material));
    instance.mesh.rotation.x = Math.PI / 2;
    instance.mesh.scale.set(10000, 10000, 10000);
    instance.mesh.position.y = -1;
    instance.mesh.receiveShadow = true;
    this.addGUI(instance);
    return instance.mesh;
  }

  addGUI(instance: BaseEntity) {
    if(environment.production) return;
    const folder = this.environmentService.gui.addFolder('Floor');
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
