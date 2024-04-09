import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {BaseEntity} from "./base-entity";
import { GUI } from 'dat.gui'
import {EnvironmentService} from "../environment/environment.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TestCubeService {

  constructor(private environmentService: EnvironmentService) { }

  generate() {
    console.log("Generating test cube")
    const instance = new BaseEntity();
    instance.setGeometry(new THREE.BoxGeometry());
    instance.setMaterial(new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true,}));
    instance.setMesh(new THREE.Mesh(instance.geometry, instance.material));
    this.addGUI(instance);
    return instance.mesh;
  }

  addGUI(instance: BaseEntity) {
    if(environment.production) return;
    const folder = this.environmentService.gui.addFolder('Test Cube');
    instance.mesh.add(new THREE.AxesHelper(5));
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
