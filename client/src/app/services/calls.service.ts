import { Injectable } from '@angular/core';
import {WebsocketsService} from "./websockets.service";
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CallsService {
    calls: CallsDictionary = { };

    private newCallSubject = new Subject<Call>();
    private initiatedCallSubject = new Subject<Call>();
    newCall = this.newCallSubject.asObservable();             // someone called you
    initiatedCall = this.initiatedCallSubject.asObservable(); // you call somebody

    constructor(private ws: WebsocketsService) {
    }

    listenSocketEvents() {
        this.ws.setUpSocketEvent(`new-call`, (event: any) => {
            this.addCall(event.message.sender, event.message);
        });

        this.ws.setUpSocketEvent(`remove-call`, (event: any) => {
            this.removeCall(event.message.sender);
        });
    }

    createCall(recipient: string, message: Call) {
        const socketMessage: any = {
            to: recipient,
            message
        };
        this.ws.sendMessage('new-call', socketMessage);
        this.initiatedCallSubject.next(message);
        // this.addCall(recipient, message);
    }

    deleteCall(recipient: string, message: Call) {
        const socketMessage: any = {
            to: recipient,
            message
        };
        this.ws.sendMessage('remove-cal', socketMessage);
        this.addCall(recipient, message);
    }

    private removeCall(resourceId: string) {
        delete this.calls[resourceId];
    }

    private addCall(recourceId: string, call: Call) {
        if (!this.calls[recourceId]) {
            this.calls[recourceId] = [];
        }
        this.calls[recourceId].push(call);
        this.calls = {...this.calls};

        this.newCallSubject.next(call);
    }
}



export interface CallsDictionary {
    [resourceId: string]: Array<Call>; // resourceId == groupId or userId;
}

export interface Call {
    id?: string;
    initiatedBy: string; // user id
    isActive?: boolean;
    scheduleDate?: number;
    creationDate?: number;
    name?: string;
}