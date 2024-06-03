import { Injectable } from '@angular/core';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import {EnvironmentService} from "../../environment/environment.service";
import {environment} from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PointerLockControlsService {
  private controls: PointerLockControls;
  keyMap = {
    'KeyW': false,
    'KeyA': false,
    'KeyS': false,
    'KeyD': false,
    'ArrowUp': false,
    'ArrowLeft': false,
    'ArrowDown': false,
    'ArrowRight': false,
  };
  constructor(private environmentService: EnvironmentService) { }

  generate() {
    if(this.controls) return;
    this.controls =  new PointerLockControls(this.environmentService.camera, this.environmentService.renderer.domElement);
    this.controls.pointerSpeed = 2;

    document.addEventListener('keydown', this.onDocumentKey.bind(this), false)
    document.addEventListener('keyup', this.onDocumentKey.bind(this), false)

    this.environmentService.addAnimationFunction(
      this.listenToKeyPress.bind(this)
    )

    this.addGUI()
  }

  addGUI() {
    if(environment.production) return;
    const folder = this.environmentService.gui.addFolder('Pointer Lock Controls');
    folder.add(this.controls, "isLocked", false);
  }

  onDocumentKey(e: { code: string | number; type: string; }) {
    // @ts-ignore
    this.keyMap[e.code] = e.type === 'keydown';
  }

  listenToKeyPress(speed = 0.35) {
    if (this.keyMap['KeyW'] || this.keyMap['ArrowUp']) {
      this.controls.moveForward(speed)
    }
    if (this.keyMap['KeyS'] || this.keyMap['ArrowDown']) {
      this.controls.moveForward(-speed)
    }
    if (this.keyMap['KeyA'] || this.keyMap['ArrowLeft']) {
      this.controls.moveRight(-speed)
    }
    if (this.keyMap['KeyD'] || this.keyMap['ArrowRight']) {
      this.controls.moveRight(speed)
    }
  }

  togglePointerLock() {
    if (document.pointerLockElement === this.environmentService.renderer.domElement) {
      document.exitPointerLock();
    } else {
      this.environmentService.renderer.domElement.requestPointerLock();
    }
  }
}
