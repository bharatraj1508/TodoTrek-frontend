import { Component } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { AuthService } from "../../../core/services/authServices/auth.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.css",
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  message: string = "";
  hasError: boolean = false;
  success: boolean = false;
  matchPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmNewPassword: ["", Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.changePasswordForm.controls["currentPassword"].valueChanges.subscribe(
      (value) => {
        if (this.hasError) {
          this.hasError = false;
          this.success = false;
          this.message = "";
        }
      }
    );

    this.changePasswordForm.controls[
      "confirmNewPassword"
    ].valueChanges.subscribe((value) => {
      if (this.changePasswordForm.controls["newPassword"].value !== value) {
        this.matchPassword = true;
      } else {
        this.matchPassword = false;
      }
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.hasError = false;
      this.message = "";

      const passwordObj = {
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
      };
      this.authService.changePassword(passwordObj).subscribe({
        next: (res) => {
          this.message = res.message;
          this.success = true;
        },
        error: (err) => {
          this.message = err.error.message;
          this.hasError = true;
        },
      });
    } else {
      this.hasError = true;
      this.message = "Please fill out all the required fields.";
      this.changePasswordForm.markAllAsTouched();
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const newPassword = control.get("newPassword");
    const confirmNewPassword = control.get("confirmNewPassword");

    return newPassword &&
      confirmNewPassword &&
      newPassword.value !== confirmNewPassword.value
      ? { passwordMismatch: true }
      : null;
  }

  getFormControlError(controlName: string): string {
    const control = this.changePasswordForm.get(controlName);
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
}
