import { Component } from '@angular/core';
import {CallsService} from "./services/calls.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    showIncomingCallBanner = false;
    showCall = false;
    callTitle: string = '';
    callId: string = '';

    // TODO: create calls queue if user receives a few simultaneous calls

    constructor(private cs: CallsService) {
        this.cs.newCall.subscribe(call => {
            this.showIncomingCallBanner = true;
            this.callTitle = call.name || '';
            this.callId = call.initiatedBy;
        });

        this.cs.initiatedCall.subscribe(call => {
            this.callTitle = call.name || '';
            this.callId = call.initiatedBy;
            this.showCall = true;
        });
    }

    declineCall(callId: string) {
        this.showIncomingCallBanner = false;
        this.callTitle = '';
        this.callId = '';
    }


    acceptCall(callId: string) {
        this.showIncomingCallBanner = false;
        this.showCall = true;
    }

    muteCall(callId: string) {
        this.showIncomingCallBanner = false;
        this.callTitle = '';
        this.callId = '';
    }

    finishCall() {
        this.showCall = false;
        this.callId = '';
        this.callTitle = '';
    }
}
