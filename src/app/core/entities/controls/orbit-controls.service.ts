import { Injectable } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {EnvironmentService} from "../../environment/environment.service";

@Injectable({
  providedIn: 'root'
})
export class OrbitControlsService {

  constructor(private environmentService: EnvironmentService) { }

  generate() {
    return new OrbitControls(this.environmentService.camera, this.environmentService.renderer.domElement);
  }
}
