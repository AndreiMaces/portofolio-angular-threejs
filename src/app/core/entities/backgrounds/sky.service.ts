import {Injectable} from '@angular/core';
import {EnvironmentService} from "../../environment/environment.service";
import {BaseEntity} from "../base-entity";
import * as THREE from "three";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SkyService {

  constructor(private environmentService: EnvironmentService) { }

  generate() {
    console.log("Generating sky")
    const instance = new BaseEntity();
    instance.setGeometry(new THREE.SphereGeometry());
    const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide,})

    const envTexture = new THREE.CubeTextureLoader().load([
      'assets/textures/px.png',
      'assets/textures/nx.png',
      'assets/textures/py.png',
      'assets/textures/ny.png',
      'assets/textures/pz.png',
      'assets/textures/nz.png',
    ])
    envTexture.mapping = THREE.CubeRefractionMapping
    material.envMap = envTexture;

    instance.setMaterial(material);
    instance.setMesh(new THREE.Mesh(instance.geometry, instance.material));
    instance.mesh.scale.set(10000, 10000, 10000);
    this.addGUI(instance);
    return instance.mesh;
  }

  addGUI(instance: BaseEntity) {
    if(environment.production) return;
    const options = {
      side: {
        FrontSide: THREE.FrontSide,
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide,
      },
      combine: {
        MultiplyOperation: THREE.MultiplyOperation,
        MixOperation: THREE.MixOperation,
        AddOperation: THREE.AddOperation,
      },
    }

    const folder = this.environmentService.gui.addFolder('Sky');
    folder.add(instance.mesh.position, 'x', -10, 10);
    folder.add(instance.mesh.position, 'y', -10, 10);
    folder.add(instance.mesh.position, 'z', -10, 10);
    folder.add(instance.mesh.rotation, 'x', 0, Math.PI * 2);
    folder.add(instance.mesh.rotation, 'y', 0, Math.PI * 2);
    folder.add(instance.mesh.rotation, 'z', 0, Math.PI * 2);
    folder.add(instance.mesh.scale, 'x', 0, 10);
    folder.add(instance.mesh.scale, 'y', 0, 10);
    folder.add(instance.mesh.scale, 'z', 0, 10);
    folder.add(instance.mesh.material, 'side', options.side)
      .onChange(() => this.updateMaterial(instance))
  }

  updateMaterial(instance: BaseEntity) {
    const material = instance.mesh.material as THREE.MeshBasicMaterial;
    material.side = Number(material.side) as THREE.Side
    material.combine = Number(material.combine) as THREE.Combine
    material.needsUpdate = true
  }
}
