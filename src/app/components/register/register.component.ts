import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { UserRegistrationRequest } from '../../model/UserRegistrationRequest';
import { UserClass } from '../../model/UserClass';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const registrationRequest: UserRegistrationRequest = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    const registeredUser: UserClass = {
      id: 0,
      username: this.username,
      email: this.email,
      password: this.password,
      roles: [{ role_id: 1, role: 'USER' }]  
    };
    
    this.authService.register(registrationRequest).subscribe({
      next: () => {
        this.authService.setRegistredUser(registeredUser);

        this.router.navigate(['/verifemail']);

        alert('Registration successful');
      },
      error: (err: any) => {
        if (err.status === 400 || err.status === 409) {
          this.error = err.error.message;
        } else {
          this.error = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }
}
