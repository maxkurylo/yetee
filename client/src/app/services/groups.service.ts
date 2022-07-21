import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {GroupOrUser, makeObjectReadonly} from "./init.service";

@Injectable({
    providedIn: 'root'
})
export class GroupsService {
    private _selectedGroup: Group | null = null;
    private _allGroups: Group[] = [];

    private selectedGroupChangedSubject = new Subject<Group | null>();
    private groupsListChangedSubject = new Subject<void>();

    selectedGroupId: string = '';

    get selectedGroup(): Group | null { return this._selectedGroup }
    get allGroups(): Group[] { return this._allGroups }

    set selectedGroup(group: Group | null) {
        this._selectedGroup = group;
        this.selectedGroupChangedSubject.next(group);
    }

    set allGroups(groups: Group[]) {
        this._allGroups = groups.map((g: Group) => makeObjectReadonly(g));
        this.groupsListChangedSubject.next();
    };

    currentGroupChanged = this.selectedGroupChangedSubject.asObservable();
    groupsListChanged = this.groupsListChangedSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    getGroupById(id: string): Group | null {
        const group = this.allGroups.filter(g => g.id === id)[0];
        return group || null;
    }

    // BE requests

    fetchAllGroups(): Observable<any> {
        return this.http.get('/api/groups/my-groups').pipe(take(1));
    }

    createGroup(group: GroupCreation) {
        return this.http.post('/api/groups/create-group', group);
    }

    alterPatricipants(participants: string[]) {
        return this.http.put('/api/groups/alter-group-participants', participants);
    }
}

export interface GroupCreation {
    name: string;
    avatarUrl?: string;
    participants?: Set<string>;
    companyId?: string;
}


export interface Group extends GroupOrUser {
    id: string;
    name: string;
    avatarUrl?: string;
    posts?: string[];
    participants?: string[];
    hasActiveCall?: boolean;
    companyId?: string;
}
