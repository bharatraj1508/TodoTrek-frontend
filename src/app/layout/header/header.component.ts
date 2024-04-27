import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/authServices/auth.service";
import { User } from "../../core/interface/user";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  isDropDownOpen: Boolean = false;
  current: User = {
    user: {
      _id: "",
      email: "",
      isVerified: "",
      firstName: "",
      lastName: "",
      googleId: "",
      accountType: "",
    },
  };

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (res) => {
        this.current = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  login() {
    this.router.navigate(["login"]);
  }
  register() {
    this.router.navigate(["register"]);
  }
  logout() {
    this.authService.doLogout();
  }

  openDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }
}
