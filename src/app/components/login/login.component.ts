import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { UserLoginRequest } from '../../model/UserLoginRequest';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-login',
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    const user: UserLoginRequest = { username: this.username, password: this.password };
    this.authService.login(user).subscribe(
      () => {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.role === 'ADMIN') {
          this.router.navigate(['/ownerspace']);
        } else {
          this.router.navigate(['/gigs']);
        }
      },
      (error) => {
        this.error = 'Invalid credentials';
      }
    );
  }
}
