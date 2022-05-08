import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotLoggedGuardService} from "./services/guards/not-logged-guard.service";
import {LoggedGuardService} from "./services/guards/logged-guard.service";
import {MainComponent} from "./pages/main/main.component";

const routes: Routes = [
    {
        path: '',
        canActivate: [LoggedGuardService],
        component: MainComponent,
        children: [
            {
                path: 'user/:userId',
                loadChildren: () => import('./pages/main/user-page/user-page.module').then(m => m.UserPageModule),
            },
            {
                path: 'group/:groupId',
                loadChildren: () => import('./pages/main/group-page/group-page.module').then(m => m.GroupPageModule),
            },
        ]
    },
    {
        path: 'login',
        canActivate: [NotLoggedGuardService],
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    },
    {
        path: 'sign-up',
        canActivate: [NotLoggedGuardService],
        loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
