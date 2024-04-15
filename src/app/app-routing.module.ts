import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./layout/login/login.component";
import { RegisterComponent } from "./layout/register/register.component";
import { authGuard } from "./core/auth.guard";
import { EmailVerifyComponent } from "./layout/account/email-verify/email-verify.component";
import { ResetPasswordComponent } from "./layout/account/reset-password/reset-password.component";
import { ForgotPasswordFormComponent } from "./layout/account/forgot-password-form/forgot-password-form.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "verify/email/action", component: EmailVerifyComponent },
  { path: "reset/password", component: ResetPasswordComponent },
  { path: "forgot-password", component: ForgotPasswordFormComponent },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
