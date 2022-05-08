import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SignUpComponent} from "./sign-up.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ExternalLoginModule} from "../login/external-login/external-login.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRippleModule} from "@angular/material/core";
import {AnimatedYetiModule} from "../../components/animated-yeti/animated-yeti.module";

const routes: Routes = [
  {path: '', component: SignUpComponent}
];

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    ExternalLoginModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    AnimatedYetiModule,
  ]
})
export class SignUpModule { }
