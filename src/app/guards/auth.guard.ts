import { Injectable } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      if (this.authService.isAdmin()) {
        return true; 
      } else if (this.authService.isUser()) {
        return true; 
      }
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
