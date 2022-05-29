import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { HomepageService } from '../homepage/homepage.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  constructor(
    private router: Router,
    private homepageService : HomepageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    let isLoggedIn = false;
    
    if(this.homepageService.userOn)
      isLoggedIn = true;

    if (isLoggedIn) {
      return true;
    } 
    else {
      alert('Must be logged in first.');
      this.router.navigate(['/home']);
      return false;
    }
  }

}