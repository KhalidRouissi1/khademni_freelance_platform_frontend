import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { UserRegistrationRequest } from '../../model/UserRegistrationRequest';
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

    const user: UserRegistrationRequest = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.authService.register(user);
    // this.authService.register(user).subscribe(
    //   () => {
    //     this.router.navigate(['/login']);
    //   },
    //   (error) => {
    //     this.error = 'Error registering user';
    //   }
    // );
  }
}