import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: String = '';
  hasError: Boolean = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        localStorage.setItem('user-token', res.token);
        this.router.navigate(['dashboard']);
      },
      (error) => {
        this.errorMessage = error;
        this.hasError = true;
      }
    );
  }
}
