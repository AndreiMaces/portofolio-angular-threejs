import {Injectable} from '@angular/core';
import {EnvironmentService} from "../environment/environment.service";
import {BaseEntity} from "./base-entity";
import * as THREE from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {MixerService} from "./mixer.service";
import {AnimationAction} from "three";
import {LightService} from "./light.service";
import * as CANNON from 'cannon-es';
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

export class Character
{
  mixer: THREE.AnimationMixer;
  modelReady = false;
  animationActions: AnimationAction[] = []
  activeAction: AnimationAction;
  lastAction: AnimationAction;
  mesh: THREE.Mesh;
  speed = 0.1;
  name: string;
  scale: number;
  color: number;
  force = false;
  constructor(name: string = 'remy', scale: number = 0.01, color: number) {
    this.name = name;
    this.scale = scale;
    this.color = color;
  }

  setAction(toAction: any) {
    if(this.force) return;
    if (toAction != this.activeAction) {
      this.lastAction = this.activeAction;
      this.activeAction = toAction;
      this.lastAction.fadeOut(0)
      this.activeAction.reset()
      this.activeAction.fadeIn(0)
      this.activeAction.play()
    }
  }

  addAnimation(object: any)
  {
    this.animationActions.push(this.mixer.clipAction(object.animations[0]));
  }

  addMovingAnimation(object: any)
  {
    object.animations[0].tracks.shift()
    this.addAnimation(object);
    return object;
  }

  addLastAnimation(object: any, progressBar: HTMLProgressElement, progressLabel: HTMLHeadingElement, animations: any = [])
  {
    object = this.addMovingAnimation(object);
    this.setAction(this.animationActions[1])
    this.modelReady = true;
    progressBar.style.display = 'none'
    progressLabel.style.display = 'none'
    return object;
  }

  walk(): void
  {
    this.speed = 0.1;
    this.setAction(this.animationActions[2]);
  }

  run(): void {
    this.speed = 0.3;
    this.setAction(this.animationActions[3]);
  }

  idle(): void {
    this.speed = 0;
    this.setAction(this.animationActions[1]);
  }

  forceIdle(): void {
    this.speed = 0;
    this.setAction(this.animationActions[1]);
    this.force = true;
  }

  currentActionIndex(): number {
    return this.animationActions.findIndex((action) => action == this.activeAction)
  }

  clone(): Character {
    return JSON.parse(JSON.stringify(this));
  }
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  counter: {[id: string] : number} = {};
  enableMovement = false;
  characterOptions = [
    {
      name: 'remy',
      scale: 0.01
    },
    {
      name: 'vanguard',
      scale: 0.02
    },
    {
      name: 'louis',
      scale: 0.02
    },
    {
      name: 'mutant',
      scale: 0.02
    },
    {
      name: 'maria',
      scale: 0.02
    }
  ]

  constructor(private environmentService: EnvironmentService, private mixerService: MixerService, private lightService: LightService, private router: Router) { }

  async generateRandom(range = 100) {
    //const randomIndex = Math.floor(Math.random() * this.characterOptions.length);
    const randomIndex = 4;
    const character = this.characterOptions[randomIndex];
    let res = await this.generate(character.name, character.scale, Math.random() * 0xffffff);
    res.mesh.position.set((Math.random() * range) - range, -1, (Math.random() * range) - range);
    return res;
  }

  async generate(characterName: string = 'remy', scale: number = 0.01, color: number) {
    console.log("Generating character named " + characterName);
    this.increaseCounter(characterName);
    const progressBar = this.environmentService.progressBar;
    const progressLabel = this.environmentService.progressLabel;
    let character: Character = new Character(characterName, scale, color);

    var animations = {
      default: () => {
        // @ts-ignore
        character.setAction(character.animationActions[0])
      },
      idle: () => {
        // @ts-ignore
        character.setAction(character.animationActions[1])
      },
      walk: () => {
        // @ts-ignore
        character.setAction(character.animationActions[2])
      },
    }

    const fbxLoader = new FBXLoader();
    await fbxLoader.loadAsync(`/assets/characters/${characterName}.fbx`, (xhr) => {
      this.updateProgress(progressBar, progressLabel, xhr, `Loading ${this.getFullCharacterName(characterName)}: `);
    }).then((object: any) => {
      object.scale.set(scale, scale, scale);
      this.initModelMixer(character, object) as THREE.Mesh;
      character.mesh = object;
    });

    await fbxLoader.loadAsync(`/assets/characters/${characterName}@idle.fbx`, (xhr) => {
      this.updateProgress(progressBar, progressLabel, xhr, `Loading ${this.getFullCharacterName(characterName)} Idle Animation: `);
    }).then((object: any) => {
      character.addAnimation(object);
    });

    await fbxLoader.loadAsync(`/assets/characters/${characterName}@walk.fbx`, (xhr) => {
      this.updateProgress(progressBar, progressLabel, xhr, `Loading ${this.getFullCharacterName(characterName)} Idle Animation: `);
    }).then((object: any) => {
      character.addMovingAnimation(object);
    });

    await fbxLoader.loadAsync(`/assets/characters/${characterName}@run.fbx`, (xhr) => {
      this.updateProgress(progressBar, progressLabel, xhr, `Loading ${this.getFullCharacterName(characterName)} Walking animation: `)
    }).then((object: any) => {
      object.scale.set(scale, scale, scale);
      character.addLastAnimation(object, progressBar, progressLabel, animations);
      this.addGUI(
        {
          mesh: character.mesh
        } as BaseEntity,
        animations,
        characterName
      );
    });
    let light = this.lightService.generatePointLight(character.mesh.position.x, character.mesh.position.y + 10, character.mesh.position.z, character.mesh.position, color);
    character.mesh.add(light);

    return character;
  }

  increaseCounter(characterName: string) {
    if(!this?.counter[characterName]) {
      this.counter[characterName] = 1;
    } else
      this.counter[characterName]++;
  }

  initModelMixer(remy: Character, object: any) {
    object.position.set(0, -1, 0)
    remy.mixer = this.mixerService.generate(object);
    this.environmentService.addMixer(remy.mixer);
    remy.animationActions.push(remy.mixer.clipAction(object.animations[0]));
    remy.activeAction = remy.animationActions[0];
    return object;
  }


  updateProgress(progressBar: HTMLProgressElement, progressLabel: HTMLHeadingElement, xhr: any, message: string) {
    if (xhr.lengthComputable) {
      progressBar.value = (xhr.loaded / xhr.total) * 100
      progressBar.style.display = 'block'
      progressLabel.style.display = 'block'
      progressLabel.innerHTML = message + Math.floor(progressBar.value) + '%'
    }
  }

  addGUI(instance: BaseEntity, animations: any = [], characterName: string) {
    if(environment.production) return;
    const folder = this.environmentService.gui.addFolder(this.getFullCharacterName(characterName));
    let axes = new THREE.AxesHelper(5);
    axes.position.set(5, 5, 5);
    instance.mesh.add(axes);
    folder.add(instance.mesh.position, 'x', -10, 10);
    folder.add(instance.mesh.position, 'y', -10, 10);
    folder.add(instance.mesh.position, 'z', -10, 10);
    folder.add(instance.mesh.rotation, 'x', 0, Math.PI * 2);
    folder.add(instance.mesh.rotation, 'y', 0, Math.PI * 2);
    folder.add(instance.mesh.rotation, 'z', 0, Math.PI * 2);
    folder.add(instance.mesh.scale, 'x', 0, 10);
    folder.add(instance.mesh.scale, 'y', 0, 10);
    folder.add(instance.mesh.scale, 'z', 0, 10);
    for (const animation in animations) {
      folder.add(animations, animation);
    }
  }

  getFullCharacterName(characterName: string) {
    return `${characterName}${this.counter[characterName]}`
  }
}
