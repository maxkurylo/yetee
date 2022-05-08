import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnimatedYetiComponent} from "./animated-yeti.component";



@NgModule({
  declarations: [AnimatedYetiComponent],
  imports: [
    CommonModule
  ],
  exports: [
    AnimatedYetiComponent
  ]
})
export class AnimatedYetiModule { }
