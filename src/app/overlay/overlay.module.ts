import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import {MobileModule} from "../core/mobile/mobile.module";



@NgModule({
    declarations: [
        OverlayComponent
    ],
    exports: [
        OverlayComponent
    ],
    imports: [
        CommonModule,
        MobileModule
    ]
})
export class OverlayModule { }
