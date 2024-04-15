import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: String = "";
  message: String = "";
  hasError: Boolean = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required]),
    });
  }

  signUp() {
    if (
      this.registerForm.controls["password"].value !==
      this.registerForm.controls["confirmPassword"].value
    ) {
      this.errorMessage = "Password doe not match";
      console.log("here");
      this.hasError = true;
      return;
    }

    const userObj = {
      email: this.registerForm.controls["email"].value,
      password: this.registerForm.controls["password"].value,
    };

    this.authService.register(userObj).subscribe(
      (res) => {
        this.message =
          "Account created successfully. Please confirm your email to proceed further";
      },
      (error) => {
        console.log(error.error.error);
        if (!error.error.message) {
          this.errorMessage = "TodoTrek Server is not responding";
        } else {
          console.log("in error");
          this.errorMessage = error.error.error;
        }
        this.hasError = true;
      }
    );
  }
}
