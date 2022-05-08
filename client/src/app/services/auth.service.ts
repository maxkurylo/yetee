import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CurrentUserService} from "./current-user.service";
import {Observable} from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import {take} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
    }

    login(data: LoginData): Observable<any> {
        return this.http.post('/api/auth/login', data).pipe(take(1));
    }

    register(data: RegistrationData): Observable<any> {
        return this.http.post('/api/auth/register', data).pipe(take(1));
    }

    logout() {
        localStorage.removeItem('token');
    }

    isLoggedIn() {
        return !this.jwtHelper.isTokenExpired();
    }
}


export interface LoginData {
    email: string;
    password: string;
}

export interface RegistrationData {
    avatarUrl?: string,
    name: string,
    email: string,
    password: string,
}