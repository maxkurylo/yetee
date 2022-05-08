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
    set user(currentUser: User ) { this._user = makeObjectReadonly(currentUser) }
    get user() { return this._user; }

    constructor(private http: HttpClient) {
    }

    // app initializer
    fetchMyUserInfo(): Observable<any> {
        return this.http.get('/api/auth/me').pipe(take(1));
    }
}
