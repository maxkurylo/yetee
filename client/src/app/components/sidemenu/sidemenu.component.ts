import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from "../../services/users.service";
import {takeUntil} from "rxjs/operators";
import {ReplaySubject} from "rxjs";
import {CurrentUserService} from "../../services/current-user.service";
import {GroupOrUser} from "../../services/init.service";
import {Group, GroupsService} from "../../services/groups.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sidemenu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit, OnDestroy {
    showCreateGroupDialog = false;
    filteredUsers: Array<User> = [];
    filteredGroups: Array<Group> = [];

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public us: UsersService, public cu: CurrentUserService, public gs: GroupsService,
                private router: Router) {
        this.updateGroupsAndContactsList();
    }

    ngOnInit(): void {
    }

    openCreateGroupDialog() {
        this.showCreateGroupDialog = true;
    }

    updateGroupsAndContactsList() {
        this.filteredUsers = [...this.us.allUsers.filter(u => u.id !== this.cu.user.id)];
        this.filteredGroups = [...this.gs.allGroups];
    }

    navigate(groupOrUser: GroupOrUser) {
        if ((groupOrUser as User).login) {
            // current object is user
            this.router.navigateByUrl('/user/' + groupOrUser.id);
        } else {
            // current object is group
            this.router.navigateByUrl('/group/' + groupOrUser.id);
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
