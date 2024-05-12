import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/authServices/auth.service";

@Component({
  selector: "app-change-email",
  templateUrl: "./change-email.component.html",
  styleUrl: "./change-email.component.css",
})
export class ChangeEmailComponent {
  changeEmailForm: FormGroup;
  hasError: boolean = false;
  success: boolean = false;
  message: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.changeEmailForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.changeEmailForm.valid) {
      this.authService.changeEmail(this.changeEmailForm.value).subscribe({
        next: (res) => {
          this.authService.doLogout(res.message);
        },
        error: (err) => {
          this.hasError = true;
          this.message = err.error.message;
        },
      });
    } else {
      this.hasError = true;
      this.message = "Please fill out all the required fields.";
      this.changeEmailForm.markAllAsTouched();
    }
  }

  getFormControlError(controlName: string): string {
    const control = this.changeEmailForm.get(controlName);
    if (control && control.touched && control.errors) {
      if (control.errors["required"]) {
        return "This field is required";
      }
      if (control.errors["email"]) {
        return "Please enter a valid email address";
      }
    }
    return "";
  }
}
