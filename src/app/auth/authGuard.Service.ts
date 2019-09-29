import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate{

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
    boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>{
        return this.authService.user.pipe(
            take(1)         //to execute only once and take the latest user.
            ,map(user => {
            const isAuth = user ? true : false;
            if(isAuth){
                return true;
            }else{
                return this.router.createUrlTree(['/auth']);
            }
        }))
    }
}