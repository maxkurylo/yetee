import {Component, Input, OnChanges} from '@angular/core';
import {Status} from "../../services/users.service";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
    @Input() avatarUrl: string | null = null;
    @Input() name: string | null = null;
    @Input() status: Status = null;

    @Input() isSquare: boolean = false;
    @Input() showStatusIndicator = false;

    abbreviation = '';
    tooltipStatus = '';
    avatarUrlError = false;

    constructor() { }

    ngOnChanges(): void {
        this.avatarUrlError = false;
        this.abbreviation = this.generateAbbreviation(this.name);
        this.tooltipStatus = this.generateTooltipStatus(this.status);
    }

    generateAbbreviation(name: string | null): string {
        if (name) {
            const splittedName = name.split(' ');
            if (splittedName.length > 1) {
                return splittedName[0][0] + splittedName[splittedName.length-1][0];
            }
            return name.substr(0, 2);
        }
        return '';
    }

    generateTooltipStatus(status: Status): string {
        switch (status) {
            case 'online': return 'Online';
            case 'in-meeting': return 'In meeting';
            default: return 'Offline';
        }
    }

}