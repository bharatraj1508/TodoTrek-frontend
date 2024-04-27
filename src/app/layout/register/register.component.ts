import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/authServices/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: String = "";
  message: String = "";
  hasError: Boolean = false;
  success: Boolean = false;
  userProfile: any;
  matchPassword: Boolean = false;
  disableRegister = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        first_name: new FormControl("", [Validators.required]),
        last_name: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl("", [Validators.required]),
      },
      { validator: this.passwordMatchValidator }
    );

    this.registerForm.controls["confirmPassword"].valueChanges.subscribe(
      (value) => {
        if (this.registerForm.controls["password"].value !== value) {
          this.matchPassword = true;
        } else {
          this.matchPassword = false;
        }
      }
    );
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

    return password &&
      confirmPassword &&
      password.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  signUp() {
    if (this.registerForm.valid) {
      const userObj = {
        firstName: this.registerForm.controls["first_name"].value,
        lastName: this.registerForm.controls["last_name"].value,
        email: this.registerForm.controls["email"].value,
        password: this.registerForm.controls["password"].value,
      };
      this.authService.register(userObj).subscribe(
        (res) => {
          this.message =
            "Account created successfully. Please confirm your email to proceed further";
          this.success = true;
        },
        (error) => {
          if (!error.error.message) {
            this.errorMessage = "TodoTrek Server is not responding";
          } else {
            this.errorMessage = error.error.message;
          }
          this.hasError = true;
        }
      );
    } else {
      this.errorMessage = "";
      this.registerForm.markAllAsTouched();
    }
  }

  getFormControlError(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control && control.touched && control.errors) {
      if (control.errors["required"]) {
        return "This field is required";
      }
      if (control.errors["email"]) {
        return "Please enter a valid email address";
      }
      if (control.errors["minlength"]) {
        return `Password must be at least ${control.errors["minlength"].requiredLength} characters long`;
      }
      if (control.errors["passwordMismatch"]) {
        return "Passwords do not match";
      }
    }
    return "";
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
            this.router.navigate(["dashboard"]);
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
