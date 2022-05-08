import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExternalLoginComponent} from "./external-login.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
      ExternalLoginComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule
  ],
  exports: [
      ExternalLoginComponent
  ]
})
export class ExternalLoginModule { }
