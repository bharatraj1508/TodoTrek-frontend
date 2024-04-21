import { Component } from "@angular/core";
import { AuthService } from "../../core/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.doLogout();
  }

  toggleSidebar() {
    var sidebar = document.getElementById("default-sidebar");
    sidebar?.classList.toggle("-translate-x-full");
  }
  closeSidebar() {
    const sidebar = document.getElementById("default-sidebar");
    sidebar?.classList.add("-translate-x-full");
  }
}
