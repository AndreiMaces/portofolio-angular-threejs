import { Injectable } from '@angular/core';
import * as THREE from 'three'
@Injectable({
  providedIn: 'root'
})
export class MixerService {
  constructor() { }

  generate(object: THREE.Object3D) {
    const mixer = new THREE.AnimationMixer(object);
    const action = mixer.clipAction(object.animations[0], object);
    action.play();
    return mixer;
  }
}
