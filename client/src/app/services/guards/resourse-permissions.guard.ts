import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {CurrentUserService} from "../current-user.service";

@Injectable({
    providedIn: 'root'
})
export class ResourcePermissionsGuard implements CanActivate {

    constructor(private cu: CurrentUserService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const groupId = route.params.groupId
        if (this.cu.authorities[groupId]) {
            return true;
        }
        this.router.navigateByUrl('404');
        return false;
    }
}
