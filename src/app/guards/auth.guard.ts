import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const jwtToken = localStorage.getItem('jwt'); // Check for jwt token in localStorage

    if (jwtToken) {
      return of(true); // If token exists, allow navigation
    }

    return this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true; // If user is authenticated, allow navigation
        }
        this.router.navigate(['/login']); // If not, redirect to /login
        return false;
      })
    );
  }
}
