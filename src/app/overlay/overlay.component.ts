import { Component, OnInit } from '@angular/core';
import {PointerLockControlsService} from "../core/entities/controls/pointer-lock-controls.service";

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  active = false;
  constructor(private pointerLockControls: PointerLockControlsService) { }

  ngOnInit(): void {
  }

  togglePointerLock() {
    this.pointerLockControls.togglePointerLock();
    this.active = !this.active;
  }

}
