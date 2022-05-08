import { Injectable } from '@angular/core';
import {ActivationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {UsersService} from "./users.service";
import {GroupsService} from "./groups.service";

@Injectable({
    providedIn: 'root'
})
export class RouterEventsService {
    constructor(private router: Router, private us: UsersService, private gs: GroupsService) {
    }

    init() {
        this.router.events
            .pipe(filter((e) => {
                return e instanceof ActivationEnd
            }))
            .subscribe((e: any) => {
                this.us.selectedUserId = e.snapshot._routerState.url.split('/user/')[1] || null;
                this.us.selectedUser = this.us.getUserById(this.us.selectedUserId);
                this.gs.selectedGroupId = e.snapshot._routerState.url.split('/group/')[1] || null;
                this.gs.selectedGroup = this.gs.getGroupById(this.gs.selectedGroupId);
            });
    }
}
