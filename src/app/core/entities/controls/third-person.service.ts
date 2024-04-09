import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {EnvironmentService} from "../../environment/environment.service";
import {OrbitControlsService} from "./orbit-controls.service";
import {Character, CharacterService} from "../character.service";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";

@Injectable({
  providedIn: 'root'
})
export class ThirdPersonService {
    camera: THREE.Camera;
    player: Character;
    controls: OrbitControls;
    fwdPressed = false;
    bkdPressed = false;
    lftPressed = false;
    rgtPressed = false;
    upVector = new THREE.Vector3( 0, 1, 0 );
    tempVector = new THREE.Vector3();
    isRunning = false;
     constructor(private environmentService: EnvironmentService, private orbitControlsService: OrbitControlsService) {
     }

    generate(character: Character)
    {
         this.init(character);
         this.environmentService.addAnimationFunctionWithDelta(this.render.bind(this));
         let found = false;
        this.environmentService.addAnimationFunction(() => {
            let door = this.environmentService.doors.find(
                door => door.entity.mesh.position.distanceTo(character.mesh.position) < 4
            );
            if(door && !found) {
                found = true;
                character.idle();
                window.open(door.link, '_self');
            }
        });
    }

    init(character: Character) {
        this.camera = this.environmentService.camera;
        this.controls = this.orbitControlsService.generate();

        this.player = character;
        this.player.mesh.castShadow = true;
        this.player.mesh.receiveShadow = true;

        this.reset();

        window.addEventListener( 'keydown',  ( e ) => {


            switch ( e.code ) {
                case 'KeyW': this.fwdPressed = true; break;
                case 'KeyS': this.bkdPressed = true; break;
                case 'KeyD': this.rgtPressed = true; break;
                case 'KeyA': this.lftPressed = true; break;
                case 'KeyE':
                    this.isRunning = true;
            }

            if(this.fwdPressed || this.bkdPressed || this.lftPressed || this.rgtPressed) {
                if(this.isRunning) this.player.run();
                else this.player.walk();
            }
        } );

        window.addEventListener( 'keyup',  ( e ) => {
            switch ( e.code ) {
                case 'KeyW':
                    this.fwdPressed = false;
                    break;
                case 'KeyS':
                    this.bkdPressed = false;
                    break;
                case 'KeyD':
                    this.rgtPressed = false;
                    break;
                case 'KeyA':
                    this.lftPressed = false;
                    break;
                case  'KeyE':
                    this.isRunning = false;
                    break;
            }
            if(!this.fwdPressed && !this.bkdPressed && !this.lftPressed && !this.rgtPressed) {
                this.player.idle();
            }
        } );
    }

    updatePlayer() {
         const speed = this.player.speed * 10;
         let newPos = this.player.mesh.clone();
        if ( this.fwdPressed ) {
            // Use physics to move the player forward
            newPos.position.add(this.camera.getWorldDirection(this.tempVector).setY(0).normalize().multiplyScalar(speed));
            this.player.mesh.lookAt(newPos.position);
        }
        if ( this.bkdPressed ) {
            newPos.position.sub(this.camera.getWorldDirection(this.tempVector).setY(0).normalize().multiplyScalar(speed));
            this.player.mesh.lookAt(newPos.position);
        }
        if ( this.lftPressed ) {
            newPos.position.add(new THREE.Vector3().crossVectors(this.upVector, this.camera.getWorldDirection(this.tempVector)).normalize().multiplyScalar(speed));
            this.player.mesh.lookAt(newPos.position);
        }
        if ( this.rgtPressed ) {
            newPos.position.sub(new THREE.Vector3().crossVectors(this.upVector, this.camera.getWorldDirection(this.tempVector)).normalize().multiplyScalar(speed));
            this.player.mesh.lookAt(newPos.position);
        }
        new TWEEN.Tween(this.player.mesh.position).to(newPos.position, 100).start();

        this.camera.position.sub( this.controls.target );
        this.controls.target.copy( this.player.mesh.position );
        this.camera.position.add( this.player.mesh.position );
    }

    render() {
         // look opposite of camera
        this.controls.maxPolarAngle = Math.PI / 2.5;
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 20;
        // Player should look forward at all times
        this.updatePlayer();
    }

    reset() {
        this.camera.position.sub( this.controls.target );
        this.controls.target.copy( this.player.mesh.position );
        this.camera.position.add( this.player.mesh.position );
     }

}
