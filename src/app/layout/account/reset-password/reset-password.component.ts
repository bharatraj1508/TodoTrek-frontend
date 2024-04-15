import { Component } from "@angular/core";
import { AuthService } from "../../../core/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
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
  hasError: Boolean = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required]),
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params["t"];
    });
  }

  ngOnInit(): void {
    if (!this.token) {
      this.router.navigate(["login"]);
    }
  }

  reset() {
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
        this.router.navigate(["login"]);
      },
      (error) => {
        this.message = "Seomthing went wrong";
        this.hasError = true;
      }
    );
  }
}
