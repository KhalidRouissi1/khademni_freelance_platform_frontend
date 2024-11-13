import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, of, switchMap, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../model/User';
import { UserLoginRequest } from '../model/UserLoginRequest';
import { UserResponse } from '../model/UserResponse';
import { UserRegistrationRequest } from '../model/UserRegistrationRequest';
import { UserClass } from '../model/UserClass';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private helper = new JwtHelperService();
  private apiURL: string = 'http://localhost:8888';
  private _token!: string;
  private _loggedUser!: string;
  private _isLoggedIn: boolean = false;
  private _roles!: string[];
  private _currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this._currentUserSubject.asObservable();
  public regitredUser : UserClass = new UserClass();

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadToken();
    this.loadUserData(); // Load user data after loading token
  }

  // Setter and Getter for registered user
  setRegistredUser(user : UserClass){
    this.regitredUser = user;
  }

  getRegistredUser(){
    return this.regitredUser;
  }

  // Registration and login methods
  register(user: UserRegistrationRequest){
      return this.http.post<User>(this.apiURL + '/register', user, { observe: 'response' });
  }

  validateEmail(code: string){
    return this.http.get<User>(this.apiURL + '/verifyEmail/' + code);
  }


  login(user: UserLoginRequest): Observable<any> {
    return this.http.post<UserLoginRequest>(this.apiURL + '/login', user, { observe: 'response' }).pipe(
      switchMap((response) => {
        this.saveToken(response.headers.get('Authorization')!);
        return this.getUser(); // Get the logged-in user data
      }),
      catchError((error) => {
        this._currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  // Load token from localStorage on initialization
  loadToken() {
    if (isPlatformBrowser(this.platformId)) {
      this._token = localStorage.getItem('jwt') || '';
    }
    this.decodeJWT();
    this._isLoggedIn = !!this._token;
  }

  // New method to load user data if token is valid
  private loadUserData() {
    if (this.isLoggedIn) {
      this.getUser().subscribe(user => {
        if (user) {
          this._currentUserSubject.next(user);
        } else {
          this._currentUserSubject.next(null);
          this.logout();
        }
      });
    }
  }

  // Decode the JWT and extract roles and loggedUser info
  decodeJWT() {
    if (!this._token || this._token === '') {
      this._roles = [];
      this._loggedUser = '';
      return;
    }

    try {
      const decodedToken = this.helper.decodeToken(this._token);
      this._roles = decodedToken.roles;
      this._loggedUser = decodedToken.sub;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      this._roles = [];
      this._loggedUser = '';
    }
  }

  // // Fetch user data using the token
  // getUser(): Observable<UserResponse | null> {
  //   if (this.isLoggedIn) {
  //     const user: UserResponse = {
  //       id: parseInt(this.loggedUser),
  //       username: this.loggedUser,
  //       role: this.roles.includes('ADMIN') ? 'ADMIN' : 'USER'
  //     };
  //     this._currentUserSubject.next(user);
  //     return of(user);  // Simulating API call response
  //   }
  //   return of(null);
  // }

  getUser(): Observable<UserResponse | null> {
    if (this.isLoggedIn) {
      const user: UserResponse = {
        id: parseInt(this.loggedUser),
        username: this.loggedUser,
        role: this.roles.includes('ADMIN') ? 'ADMIN' : 'USER'
      };
      this._currentUserSubject.next(user);  // Update the current user subject
      return of(user);
    }
    return of(null);
  }

  // Other supporting methods
  getCurrentUser(): UserResponse | null {
    return this._currentUserSubject.value;
  }

  saveToken(jwt: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('jwt', jwt);
    }
    this._token = jwt;
    this._isLoggedIn = true;
    this.decodeJWT();
  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId) && !this._token) {
      this._token = localStorage.getItem('jwt') || '';
    }
    return this._token;
  }

  isAdmin(): boolean {
    return this._roles?.includes('ADMIN') || false;
  }

  isUser(): boolean {
    return this._roles?.includes('USER') || false;
  }

  logout() {
    this._loggedUser = undefined!;
    this._roles = undefined!;
    this._token = undefined!;
    this._isLoggedIn = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt');
    }
    this._currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isTokenExpired(): boolean {
    return this.helper.isTokenExpired(this._token);
  }

  isTokenAboutToExpire(): boolean {
    if (!this._token) return true;
    const expirationDate = this.helper.getTokenExpirationDate(this._token);
    if (!expirationDate) return true;
    return (expirationDate.getTime() - Date.now()) / 1000 < 300; // Less than 5 minutes
  }

  refreshToken(): Observable<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return of(false);
      }
      return this.http.post<any>(`${this.apiURL}/refresh-token`, { refreshToken }).pipe(
        switchMap(response => {
          this.saveToken(response.token);
          return of(true);
        }),
        catchError(() => of(false))
      );
    }
    return of(false);
  }

  ensureAuthenticatedRequest(): Observable<boolean> {
    if (this.isTokenAboutToExpire()) {
      return this.refreshToken();
    }
    return of(true);
  }

  get token(): string {
    return this._token;
  }

  get loggedUser(): string {
    return this._loggedUser;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get roles(): string[] {
    return this._roles;
  }
}
