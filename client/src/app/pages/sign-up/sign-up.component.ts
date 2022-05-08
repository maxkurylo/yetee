import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService, RegistrationData} from "../../services/auth.service";
import {Router} from "@angular/router";
import {InitService} from "../../services/init.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
    public registrationForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        repeatPassword: new FormControl('', [Validators.required]),
    });

    public isPasswordVisible: boolean = false;

    constructor(private authService: AuthService, private router: Router, private initService: InitService) { }

    ngOnInit(): void {
    }

    public register() {
        if (this.registrationForm.valid) {
            const data: RegistrationData = {
                name: this.registrationForm.controls.name.value,
                email: this.registrationForm.controls.email.value,
                password: this.registrationForm.controls.password.value,
            };
            this.authService.register(data)
                .subscribe(data => {
                    if (data.token) {
                        this.logUserIn(data.token);
                    } else {
                        console.log('EMAIL CONFIRMATION');
                    }
                }, err => {
                    // handle registration errors
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


    public onPasswordVisibleToggle() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

}
