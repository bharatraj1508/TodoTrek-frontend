import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { HeaderComponent } from "./header/header.component";
import { RegisterComponent } from "./register/register.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { EmailVerifyComponent } from "./account/email-verify/email-verify.component";
import { ResetPasswordComponent } from "./account/reset-password/reset-password.component";
import { ForgotPasswordFormComponent } from "./account/forgot-password-form/forgot-password-form.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    EmailVerifyComponent,
    ResetPasswordComponent,
    ForgotPasswordFormComponent,
    SidebarComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [HeaderComponent, SidebarComponent],
})
export class LayoutModule {}
