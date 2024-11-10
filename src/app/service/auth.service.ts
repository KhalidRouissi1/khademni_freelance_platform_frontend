import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): boolean {
    // Hardcoded users for demo
    const users: User[] = [
      { id: 1, email: 'creator@example.com', role: 'CREATOR', name: 'John Creator' },
      { id: 2, email: 'freelancer@example.com', role: 'FREELANCER', name: 'Jane Freelancer' }
    ];

    const user = users.find(u => u.email === email);
    if (user && password === 'password') {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // New method to check if the user is a creator (owner)
  isOwner(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === 'CREATOR';
  }
}
