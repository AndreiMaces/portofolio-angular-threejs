import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoystickComponent } from './components/joystick/joystick.component';



@NgModule({
    declarations: [
        JoystickComponent
    ],
    exports: [
        JoystickComponent
    ],
    imports: [
        CommonModule
    ]
})
export class MobileModule { }
