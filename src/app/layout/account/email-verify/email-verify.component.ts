import { Component } from "@angular/core";
import { AuthService } from "../../../core/services/authServices/auth.service";
import { ActivatedRoute } from "@angular/router";
import { OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-email-verify",
  templateUrl: "./email-verify.component.html",
  styleUrl: "./email-verify.component.css",
})
export class EmailVerifyComponent implements OnInit {
  success: Boolean = false;
  hasErrors: Boolean = false;
  token: String = "";
  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params["t"];
    });
  }

  ngOnInit(): void {
    if (this.token) {
      this.authService.verifyEmail(this.token).subscribe(
        (res) => {
          this.success = true;
        },
        (error) => {
          this.hasErrors = true;
        }
      );
      return;
    }
    this.route.navigate(["login"]);
  }
}
