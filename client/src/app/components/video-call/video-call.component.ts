import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CurrentUserService} from "../../services/current-user.service";
import {GroupsService} from "../../services/groups.service";

@Component({
    selector: 'app-video-call',
    templateUrl: './video-call.component.html',
    styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
    @ViewChild('iframeWrapper', {static: true}) iframeWrapperRef: ElementRef;

    @Input() callTitle: string = '';
    @Input() callId: string = '';

    @Output() close = new EventEmitter<void>();

    constructor(private cu: CurrentUserService) { }

    ngOnInit(): void {
        const domain = "meet.jit.si";
        const options = {
            roomName: this.callId,
            userInfo: {
                displayName: this.cu.user.name
            },
            parentNode: this.iframeWrapperRef.nativeElement,
            prejoinPageEnabled: false,
            configOverwrite: {
                // prejoinPageEnabled: false,  // should be disabled in case of 1 to 1 call
                disableProfile: true,
                hideEmailInSettings: true,
                readOnlyName: true,
                enableClosePage: false,
            },
            interfaceConfigOverwrite: {
                SHOW_PROMOTIONAL_CLOSE_PAGE: false
            }
        };
        const api = new (window as any).JitsiMeetExternalAPI(domain, options);
        api.executeCommand('subject', this.callTitle);

        api.addEventListener('videoConferenceLeft', () => {
            this.close.emit();
        });
    }

}
