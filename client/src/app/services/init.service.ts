import { Injectable } from '@angular/core';
import {CurrentUserService} from "./current-user.service";
import {AuthService} from "./auth.service";
import {User, UsersService} from "./users.service";
import {RouterEventsService} from "./router-events.service";
import {Group, GroupsService} from "./groups.service";
import {WebsocketsService} from "./websockets.service";
import {CallsService} from "./calls.service";
import {CompaniesService, Company} from "./companies.service";

@Injectable({
    providedIn: 'root'
})
export class InitService {
    constructor(private authService: AuthService, private cu: CurrentUserService, private us: UsersService,
                private re: RouterEventsService, private gs: GroupsService, private socketsService: WebsocketsService,
                private cs: CallsService, private companiesService: CompaniesService) {
    }

    init(): Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            const removedQueryParams = window.location.href.replace(window.location.search, '');
            window.history.replaceState({}, document.title, removedQueryParams);
            localStorage.setItem('token', token);
        }
        this.re.init();
        if (this.authService.isLoggedIn()) {
            return this.initImportantData()
                .then(() => this.initSecondaryData())
                .catch(err => {
                    // logout user if something is wrong with important info
                    console.error(err);
                    this.authService.logout();
                    window.location.assign('/login');
                });
        } else {
            return Promise.resolve();
        }
    }


    initImportantData(): Promise<void> {
        return Promise.all([
            this.cu.fetchMyUserInfo().toPromise(),
            this.us.fetchAllUsers().toPromise(),
            this.gs.fetchAllGroups().toPromise(),
            this.socketsService.init(),
        ])
            .then(([currentUser, users, groups, _]) => {
                this.cu.user = currentUser;
                this.us.allUsers = users;
                this.gs.allGroups = groups;
                return Promise.resolve();
            })
    }

    // Some secondary data, like meetings, notifications etc. Must always be resolved
    // Can be user after sockets reconnect or when page is active again
    // TODO: create service to track what doesn't work
    initSecondaryData(): Promise<void> {
        this.cs.listenSocketEvents();
        return Promise.resolve();
    }
}

export function makeObjectReadonly(object: any) {
    return Object.freeze(object);
}


export interface GroupOrUser {
    id: string,
    name: string,
    avatarUrl?: string
}