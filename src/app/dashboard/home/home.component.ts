import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/services/authServices/auth.service";
import { User } from "../../core/interface/user";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
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

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((res) => {
      this.current = res;
    });
  }
}
