import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../core/services/authServices/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: String = "";
  hasError: Boolean = false;
  userProfile: any;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    });

    this.loginForm.valueChanges.subscribe(() => {
      if (this.hasError) {
        this.hasError = false;
        this.errorMessage = "";
      }
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (res) => {
          localStorage.setItem("user-token", res.token);
          this.router.navigate(["dashboard/home"]);
        },
        (error) => {
          const unauthrisedStatusCode = [401, 404];
          if (unauthrisedStatusCode.includes(error.status)) {
            if (error.error.message == "User email is not verified")
              this.errorMessage = error.error.message;
            else {
              this.errorMessage =
                "Email or Password is incorrect. Please try again.";
            }
          } else if (!error.error.message) {
            this.errorMessage = "TodoTrek Server is not responding";
          } else {
            this.errorMessage = error.error.message;
          }
          this.hasError = true;
        }
      );
    } else {
      this.errorMessage = "Email or Password must be provided";
      this.hasError = true;
    }
  }

  ngOnInit(): void {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      this.userProfile = JSON.parse(loggedInUser);
      if (this.userProfile) {
        const googleUser = {
          firstName: this.userProfile.given_name,
          lastName: this.userProfile.family_name,
          email: this.userProfile.email,
          googleId: this.userProfile.sub,
        };

        this.authService.googleSignin(googleUser).subscribe(
          (res) => {
            localStorage.setItem("user-token", res.token);
            this.router.navigate(["dashboard/home"]);
          },
          (error) => {
            this.errorMessage = error.error.message;
            this.hasError = true;
          }
        );
      }
    }
  }
}
