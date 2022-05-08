import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {MatStepperModule} from "@angular/material/stepper";
import {MatInputModule} from "@angular/material/input";
import {CreateGroupDialogComponent} from "./create-group-dialog.component";
import {AvatarModule} from "../avatar/avatar.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";



@NgModule({
  declarations: [CreateGroupDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatInputModule,
        AvatarModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule
    ],
  exports: [
    CreateGroupDialogComponent
  ]
})
export class CreateGroupDialogModule { }
