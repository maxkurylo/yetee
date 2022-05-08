import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SubHeaderModule} from "../../../components/sub-header/sub-header.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AvatarModule} from "../../../components/avatar/avatar.module";
import {ChatModule} from "../../../components/chat/chat.module";
import {GroupPageComponent} from "./group-page.component";

const routes: Routes = [
  { path: '', component: GroupPageComponent }
];

@NgModule({
  declarations: [GroupPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SubHeaderModule,
    MatButtonModule,
    MatIconModule,
    AvatarModule,
    ChatModule
  ]
})
export class GroupPageModule { }
