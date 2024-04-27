import { Component } from "@angular/core";
import { AuthService } from "../../../core/services/authServices/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { OnInit } from "@angular/core";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.css",
})
export class ResetPasswordComponent implements OnInit {
  token: String = "";
  resetPasswordForm: FormGroup;
  message: String = "";
  success: Boolean = false;
  hasError: Boolean = false;
  matchPassword: Boolean = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl("", [Validators.required]),
      },
      { validator: this.passwordMatchValidator }
    );
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params["t"];
    });

    this.resetPasswordForm.controls["confirmPassword"].valueChanges.subscribe(
      (value) => {
        if (this.resetPasswordForm.controls["password"].value !== value) {
          this.matchPassword = true;
        } else {
          this.matchPassword = false;
        }
      }
    );
  }

  ngOnInit(): void {
    if (!this.token) {
      this.router.navigate(["login"]);
    }
  }

  reset() {
    if (this.resetPasswordForm.valid) {
      if (
        this.resetPasswordForm.controls["password"].value !==
        this.resetPasswordForm.controls["confirmPassword"].value
      ) {
        this.message = "Password doe not match";
        this.hasError = true;
        return;
      }

      const passwordObj = {
        password: this.resetPasswordForm.controls["password"].value,
      };

      this.authService.resetPassword(passwordObj, this.token).subscribe(
        (res) => {
          this.message =
            "Password updated successfully. Please login with your new password.";
          this.success = true;
        },
        (error) => {
          this.message =
            "Seomthing went wrong. Please send a new passowrd reset request";
          this.hasError = true;
        }
      );
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  getFormControlError(controlName: string): string {
    const control = this.resetPasswordForm.get(controlName);
    if (control && control.touched && control.errors) {
      if (control.errors["required"]) {
        return "This field is required";
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
}
