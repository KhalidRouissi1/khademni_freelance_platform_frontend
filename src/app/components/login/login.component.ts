import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { UserLoginRequest } from '../../model/UserLoginRequest';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const user: UserLoginRequest = { username: this.username, password: this.password };

    // Trigger login in the authService
    this.authService.login(user).subscribe(
      (response) => {
        const currentUser = this.authService.getCurrentUser();
        console.log(currentUser)
        if (currentUser) {
          // Ensure role is properly checked
          if (currentUser.role === 'ADMIN') {
            this.router.navigate(['/ownerspace']);
          } else if (currentUser.role === 'USER') {
            this.router.navigate(['/gigs']);
          } else {
            this.error = 'Role not recognized.';
          }
        } else {
          this.error = 'Failed to retrieve user details after login';
        }
      },
      (error) => {
        this.error = 'Invalid credentials';
      }
    );
  }
}
