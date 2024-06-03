import { Component, OnInit } from '@angular/core';
import * as nipplejs from 'nipplejs';

type KeysObject = {
  KeyW: boolean[],
  KeyA: boolean[],
  KeyS: boolean[],
  KeyD: boolean[]
}

@Component({
  selector: 'app-joystick',
  templateUrl: './joystick.component.html',
  styleUrls: ['./joystick.component.scss']
})
export class JoystickComponent implements OnInit {
  keys: KeysObject = {
    KeyW: [],
    KeyA: [],
    KeyS: [],
    KeyD: []
  }
  constructor() { }

  generateKeydownEvent(keyCode: string): void
  {
    let event = new KeyboardEvent('keydown', {
      key: "W",
      code: "W",
    });

    document.getElementById('zone_joystick').dispatchEvent(event);

    console.log(keyCode + " keydown")

  }

  generateKeyupEvent(keyCode: string): void
  {
    let event = new KeyboardEvent('keyup', {
      key: keyCode,
      code: keyCode,
    });
    document.getElementById('zone_joystick').dispatchEvent(event);
    console.log(keyCode + " keyup")
  }

  ngOnInit(): void {
    let joystickHTMLElement = document.getElementById('zone_joystick');
    console.log(joystickHTMLElement)
    let options = {
      zone: joystickHTMLElement,
      restJoystick: true,
    };
    let manager = nipplejs.create(options);
    manager.on('move', (evt, data) => {
      this.updateKeys(data);
    })
  }

  updateKey(keyCode: string): void
  {
    // @ts-ignore
    let key = this.keys[keyCode];
    if(key[key.length - 1] !== key[key.length - 2])
    {
      if(key[key.length - 1] === false) this.generateKeyupEvent(keyCode);
      else this.generateKeydownEvent(keyCode);
    }
  }

  updateKeysObject(data: nipplejs.JoystickOutputData): void
  {
    if(data?.direction?.x)
    {
      if(data?.direction?.x === "left") {
        this.keys.KeyA.push(true);
        this.keys.KeyD.push(false);
      } else if(data?.direction?.x === "right")
      {
        this.keys.KeyA.push(false);
        this.keys.KeyD.push(true);
      }
    } else {
      this.keys.KeyA.push(false);
      this.keys.KeyD.push(false);
    }


    if(data?.direction?.y)
    {
      if(data?.direction?.y === "up")
      {
        this.keys.KeyW.push(false);
        this.keys.KeyS.push(false);
      } else if(data?.direction.y === "down")
      {
        this.keys.KeyW.push(false);
        this.keys.KeyS.push(true);
      }
    } else {
      this.keys.KeyW.push(false);
      this.keys.KeyS.push(false);
    }
  }

  updateKeys(data: nipplejs.JoystickOutputData): void
  {
    this.updateKeysObject(data)
    this.updateKey('KeyW');
    this.updateKey('KeyA');
    this.updateKey('KeyS');
    this.updateKey('KeyD');
  }

}
