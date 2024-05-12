import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard.component";
import { ProjectComponent } from "./project/project.component";
import { NewComponent } from "./project/new/new.component";
import { ChangePasswordComponent } from "./profile/change-password/change-password.component";
import { ChangeEmailComponent } from "./profile/change-email/change-email.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "home", component: HomeComponent },
      { path: "project/:pid", component: ProjectComponent },
      { path: "new/project", component: NewComponent },
      { path: "edit/project/:pid", component: NewComponent },
      { path: "profile/change-password", component: ChangePasswordComponent },
      { path: "profile/change-email", component: ChangeEmailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
