import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotLoggedGuardService} from "./services/guards/not-logged-guard.service";
import {LoggedGuardService} from "./services/guards/logged-guard.service";
import {MainComponent} from "./pages/main/main.component";
import {ResourcePermissionsGuard} from "./services/guards/resourse-permissions.guard";

const routes: Routes = [
    {
        path: '',
        canActivate: [LoggedGuardService],
        component: MainComponent,
        children: [
            {
                canActivate: [ResourcePermissionsGuard],
                path: 'user/:userId',
                loadChildren: () => import('./pages/main/user-page/user-page.module').then(m => m.UserPageModule),
            },
            {
                canActivate: [ResourcePermissionsGuard],
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
    {
        path: 'not-found',
        loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule),
    },
    { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
