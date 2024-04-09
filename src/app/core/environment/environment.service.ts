import { Injectable } from '@angular/core';
import * as THREE from 'three'
import {GUI} from "dat.gui";
import {CharacterService} from "../entities/character.service";
import TWEEN from "@tweenjs/tween.js";
import {MultiplayerService} from "./multiplayer.service";
import {BaseEntity} from "../entities/base-entity";
import * as CANNON from "cannon-es";
import {Door} from "../entities/door.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cannonWorld: CANNON.World;
  public clock = new THREE.Clock()
  public gui: GUI;
  public functions: any[] = [];
  private _mixers: THREE.AnimationMixer[] = [];
  font = "https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json";
  progressBar: HTMLProgressElement;
  progressLabel: HTMLHeadingElement;
  doors: Door[] = [];
  initializeEnvironment() {
    console.log("Initializing environment")
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.gui = new GUI();
    if(environment.production)
    {
      this.gui.hide();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cannonWorld = new CANNON.World();
    document.body.appendChild(this.renderer.domElement);
    this.camera.position.y = 2;
    this.camera.position.z = 5;
    window.addEventListener('resize', this.render.bind(this));
    this.animate();
  }

  // On window resize, adjust the camera aspect ratio and renderer size
  render() {
    console.log("Resizing")
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    TWEEN.update();
    for (const func of this.functions) {
      func();
    }
    const delta = this.clock.getDelta();
    for (const mixer of this._mixers) {
      mixer.update(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }

  addAnimationFunction(func: any) {
    this.functions.push(func);
  }

  addAnimationFunctionWithDelta(func: any, delta?: number) {
    this.functions.push(() => {
      func(delta)
    });
  }

  addMixer(mixer: THREE.AnimationMixer) {
    this._mixers.push(mixer);
  }

    setProgressBar(progress: HTMLProgressElement) {
        this.progressBar = progress;
    }

    setProgressLabel(progress: HTMLHeadingElement) {
        this.progressLabel = progress;
    }

    addDoor(door: Door) {
        this.doors.push(door);
    }
}
