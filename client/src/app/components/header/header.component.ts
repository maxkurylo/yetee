import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CurrentUserService} from "../../services/current-user.service";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(private router: Router, public cu: CurrentUserService, private authService: AuthService) { }

    ngOnInit(): void {
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

}
