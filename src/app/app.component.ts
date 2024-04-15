import { Component } from "@angular/core";
import { AuthService } from "./core/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "TodoTrek-frontend";

  constructor(public authService: AuthService) {}
}
