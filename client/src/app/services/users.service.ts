import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {GroupOrUser, makeObjectReadonly} from "./init.service";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private _selectedUser: User | null = null;
    private _allUsers: User[] = [];
    private selectedUserChangedSubject = new Subject<User | null>();
    private usersListChangedSubject = new Subject<void>();

    selectedUserId: string = '';

    get allUsers(): User[] { return this._allUsers }
    get selectedUser(): User | null { return this._selectedUser }

    set allUsers(users: User[]) {
        this._allUsers = users.map((u: User) => makeObjectReadonly(u));
        this.usersListChangedSubject.next();
    }

    set selectedUser(user: User | null) {
        this._selectedUser = user;
        this.selectedUserChangedSubject.next(user);
    }

    selectedUserChanged = this.selectedUserChangedSubject.asObservable();
    userListChanged = this.usersListChangedSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    getUserById(id: string): User | null {
        const user = this.allUsers.filter(u => u.id === id)[0];
        return user || null;
    }

    fetchAllUsers(): Observable<any> {
        return this.http.get('/api/users/get-all-users').pipe(take(1));
    }
}

export interface User extends GroupOrUser {
    id: string;
    name: string;
    avatarUrl?: string;
    login?: string;
    email?: string;
    emailIsVerified?: boolean;
    status?: Status
}

export type Status = 'online' | 'offline' | 'in-meeting' | null | undefined

