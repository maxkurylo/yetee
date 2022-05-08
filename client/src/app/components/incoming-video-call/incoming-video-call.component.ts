import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-incoming-video-call',
    templateUrl: './incoming-video-call.component.html',
    styleUrls: ['./incoming-video-call.component.scss']
})
export class IncomingVideoCallComponent implements OnInit {
    @Input() callTitle: string = '';
    @Input() callId: string = '';

    @Output() decline = new EventEmitter<string>();
    @Output() accept = new EventEmitter<string>();
    @Output() mute = new EventEmitter<string>();

    constructor() { }

    ngOnInit(): void {
    }

}
