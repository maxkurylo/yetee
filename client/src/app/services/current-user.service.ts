import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
import {Observable} from "rxjs";
import {User} from "./users.service";
import {makeObjectReadonly} from "./init.service";

@Injectable({
    providedIn: 'root'
})
export class CurrentUserService {
    private _user: User = { id: '', name: ''};
    private _authorities: AuthoritiesMap = {};

    public set user(currentUser: User ) { this._user = makeObjectReadonly(currentUser) }
    public get user() { return this._user; }

    public set authorities(auths: AuthoritiesMap ) {
        this._authorities = auths;
    }
    public get authorities() { return this._authorities; }

    constructor(private http: HttpClient) {
    }

    // app initializer
    public fetchMyUserInfo(): Observable<any> {
        return this.http.get('/api/auth/me').pipe(take(1));
    }

    public fetchMyAuthorities(): Observable<any> {
        return this.http.get('/api/auth/my-authorities').pipe(take(1));
    }
}


export interface AuthoritiesMap {
    [resourceId: string]: Set<string>
}
