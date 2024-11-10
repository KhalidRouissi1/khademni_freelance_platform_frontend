import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone:true,
  imports:[FormsModule],
  selector: 'app-login',
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.authService.login(this.email, this.password)) {
      const currentUser = this.authService.getCurrentUser();
      console.log(currentUser)
      if (!this.authService.isOwner()) {
        this.router.navigate(['/gigs']);
      } else {
        this.router.navigate(['/ownerspace']);
      }
    } else {
      this.error = 'Invalid credentials';
    }
  }
}