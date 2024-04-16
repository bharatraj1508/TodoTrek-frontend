import { Component } from "@angular/core";
import { AuthService } from "../../../core/auth.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-forgot-password-form",
  templateUrl: "./forgot-password-form.component.html",
  styleUrl: "./forgot-password-form.component.css",
})
export class ForgotPasswordFormComponent {
  message: String = "";
  success: Boolean = false;
  failure: Boolean = false;
  emailForm: FormGroup;
  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder
  ) {
    this.emailForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
    });

    this.emailForm.valueChanges.subscribe(() => {
      if (this.failure) {
        this.failure = false;
        this.message = "";
      }
    });
  }

  sendEmail() {
    if (!this.emailForm.valid) {
      this.message = "Please enter a valid email address.";
      this.failure = true;
      return;
    }
    this.authService.sendPasswordResetEmail(this.emailForm.value).subscribe(
      (res) => {
        this.message = res.message;
        this.success = true;
      },
      (error) => {
        this.message = error.error.message;
        this.failure = true;
      }
    );
  }
}
