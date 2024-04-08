import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, HeaderComponent, RegisterComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [HeaderComponent],
})
export class LayoutModule {}
