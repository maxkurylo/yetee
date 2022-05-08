import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AnimatedYetiModule} from "../../components/animated-yeti/animated-yeti.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ExternalLoginModule} from "./external-login/external-login.module";
import {MatRippleModule} from "@angular/material/core";

const routes: Routes = [
    {path: '', component: LoginComponent}
];

@NgModule({
  declarations: [
    LoginComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        AnimatedYetiModule,
        MatFormFieldModule,
        MatInputModule,
        ExternalLoginModule,
        MatRippleModule
    ]
})
export class LoginModule { }
