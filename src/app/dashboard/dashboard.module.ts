import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { HomeComponent } from "./home/home.component";
import { LayoutModule } from "../layout/layout.module";
import { ProjectComponent } from "./project/project.component";
import { NewComponent } from "./project/new/new.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NewTaskComponent } from './task/new-task/new-task.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProjectComponent,
    NewComponent,
    NewTaskComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
  ],
})
export class DashboardModule {}
