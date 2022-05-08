import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from "@angular/common/http";
import {JwtModule, JwtModuleOptions} from "@auth0/angular-jwt";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {InitService} from "./services/init.service";
import {AvatarModule} from "./components/avatar/avatar.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {SubHeaderModule} from "./components/sub-header/sub-header.module";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MainComponent} from "./pages/main/main.component";
import {HeaderComponent} from "./components/header/header.component";
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import {MatDialogModule} from "@angular/material/dialog";
import {CreateGroupDialogModule} from "./components/create-group-dialog/create-group-dialog.module";
import { VideoCallComponent } from './components/video-call/video-call.component';
import { IncomingVideoCallComponent } from './components/incoming-video-call/incoming-video-call.component';


const JWT_Module_Options: JwtModuleOptions = {
    config: {
        tokenGetter: () => localStorage.getItem('token'),
    }
};

function initializeAppFactory(initService: InitService) {
    return () => initService.init();
}

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        HeaderComponent,
        SidemenuComponent,
        VideoCallComponent,
        IncomingVideoCallComponent,
    ],
    imports: [
        AvatarModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        JwtModule.forRoot(JWT_Module_Options),
        BrowserAnimationsModule,
        CreateGroupDialogModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        SubHeaderModule,
        MatBadgeModule,
        MatTooltipModule,
        MatDialogModule,
    ],
    providers: [{
        provide: APP_INITIALIZER,
        useFactory: initializeAppFactory,
        deps: [InitService],
        multi: true
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
