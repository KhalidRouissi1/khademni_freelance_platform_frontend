import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserClass } from '../../model/UserClass';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verif-email',
  templateUrl: './verif-email.component.html',
  styleUrls: ['./verif-email.component.css'],
  imports: [FormsModule],
  standalone: true
})
export class VerifEmailComponent implements OnInit {
  code: string = "";
  user: UserClass = new UserClass();
  err: string = "";

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getRegistredUser();
  }

  onValidateEmail() {
    this.authService.validateEmail(this.code).subscribe({
      next: (res) => {
        this.router.navigate(['/'])
        // this.authService.login({
        //   username: this.user.username,
        //   password: this.user.password
        // }).subscribe({
        //   next: (data) => {
        //     let jwToken = data.headers.get('Authorization')!;
        //     this.authService.saveToken(jwToken);
        //     alert('Email verification and login successful');
        //     this.router.navigate(['/']);
        //   },
        //   error: (err) => {
        //     console.log('Login error:', err);
        //     this.err = "Login failed after verification";
        //   }
        // });
      },
      error: (err) => {
        if (err.error.errorCode === "INVALID_TOKEN") {
          this.err = "Votre code n'est pas valide !";
        } else if (err.error.errorCode === "EXPIRED_TOKEN") {
          this.err = "Votre code a expiré !";
        }
      }
    });
  }
}