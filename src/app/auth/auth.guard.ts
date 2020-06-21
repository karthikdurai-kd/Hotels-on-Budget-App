import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authServiceObj: AuthService, private route:Router){}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean{
   
    return this.authServiceObj.isUserAuthenticated.pipe(take(1),
    switchMap(isAuthenicated=>{
       if(!isAuthenicated){
          return this.authServiceObj.autoLogin();
       }
       else{
         return of(isAuthenicated);
       }
    }),
    tap(AuthBool=>{
      if(!AuthBool){
        this.route.navigateByUrl('/auth')
      }
    }));
  }
}
