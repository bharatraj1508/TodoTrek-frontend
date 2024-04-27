import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ObjectId } from "mongoose";
import { ProjectService } from "../../core/services/projectService/project.service";
import { Project } from "../../core/interface/project";
import { Task } from "../../core/interface/task";
import { Category } from "../../core/interface/category";
import { ProjectEventService } from "../../core/services/sharedServices/project-event.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrl: "./project.component.css",
})
export class ProjectComponent implements OnInit {
  projectId: ObjectId | null = null;
  project: Project | null = null;
  projectTasks: Task[] = [];
  projectCategory: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private projectEventService: ProjectEventService
  ) {
    this.route.params.subscribe((params) => {
      if (params["pid"]) {
        this.projectId = params["pid"];
        this.loadProject();
      }
    });
  }

  ngOnInit(): void {
    this.projectEventService.projectDeleted$.subscribe((id) => {
      if (id === this.projectId) {
        this.router.navigate(["/dashboard/home"]);
      }
    });
  }

  loadProject() {
    if (this.projectId) {
      this.projectService.getSingleProject(this.projectId).subscribe((res) => {
        this.project = res;
        this.projectTasks = res.tasks || [];
        this.projectCategory = res.categories || [];
      });
    }
  }
}
