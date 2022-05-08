import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService, LoginData, RegistrationData} from "../../services/auth.service";
import {take} from "rxjs/operators";
import {CurrentUserService} from "../../services/current-user.service";
import {Router} from "@angular/router";
import {InitService} from "../../services/init.service";
import {AnimatedYetiService} from "../../services/animated-yeti.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    @ViewChild('email', { static: false }) emailRef: ElementRef;

    public loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
    });

    public isPasswordVisible: boolean = false;

    // prevent yeti hand shake when user click 'Show password' icon
    private preventUncoverEyes = false;

    constructor(private authService: AuthService, private cu: CurrentUserService,
                private router: Router, private initService: InitService, private ays: AnimatedYetiService) { }

    ngOnInit(): void {

    }

    ngAfterViewInit() {
        this.ays.startBlinking$.next(2);
    }


    public login() {
        if (this.loginForm.valid) {
            const data: LoginData = {
                email: this.loginForm.controls.email.value,
                password: this.loginForm.controls.password.value,
            };
            this.authService.login(data)
                .subscribe(data => {
                    if (data.token) {
                        this.logUserIn(data.token);
                    }
                }, err => {
                    if (err.status == 404) {
                        console.log('ACCOUNT DOESNT EXIST');
                    }
                    // TODO: handle sign in errors
                    console.error(err)
                });
        } else {
            // handle if form is invalid
        }

    }


    private logUserIn(token: string) {
        localStorage.setItem('token', token);
        this.initService.init()
            .then(() => this.router.navigateByUrl('/'));

    }

    public onEmailFocus() {
        const rect = this.emailRef.nativeElement.getBoundingClientRect();
        this.ays.lookAtPoint$.next({ x: rect.x, y: rect.y });
    }

    public onEmailBlur() {
        this.ays.resetFace$.next();
    }

    public onPasswordFocus() {
        this.ays.coverEyes$.next();
    }

    public onPasswordBlur() {
        if (!this.preventUncoverEyes) {
            this.ays.uncoverEyes$.next();
        }
    }

    public onPasswordVisibleToggle() {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.preventUncoverEyes = true;
        if (this.isPasswordVisible) {
            this.ays.spreadFingers$.next();
        } else {
            this.ays.closeFingers$.next();
        }
        setTimeout(() => {
            this.preventUncoverEyes = false;
        }, 10)
    }

}