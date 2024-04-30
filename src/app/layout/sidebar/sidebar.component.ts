import { Component } from "@angular/core";
import { AuthService } from "../../core/services/authServices/auth.service";
import { ProjectService } from "../../core/services/projectService/project.service";
import { OnInit } from "@angular/core";
import { Project } from "../../core/interface/project";
import { Router } from "@angular/router";
import { ObjectId } from "mongoose";
import { ProjectEventService } from "../../core/services/sharedServices/project-event.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  projects: Project[] = [];
  showDeleteConfirmation: boolean = false;
  projectIdToDelete: ObjectId | null = null;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    public router: Router,
    public projectEventService: ProjectEventService
  ) {}

  ngOnInit() {
    // we subscribe to the projectCreated$ observable in the shared service
    // and we push the newly created project to the projects array once the event is emitted and this observer is notified
    this.projectEventService.projectCreated$.subscribe((project) => {
      this.projects.push(project);
    });
    this.projectEventService.projectDeleted$.subscribe((projectId) => {
      this.projects = this.projects.filter((pr) => pr._id !== projectId);
    });
    this.projectEventService.projectUpdated$.subscribe((project) => {
      this.projects = this.projects.map((pr) =>
        pr._id === project._id ? project : pr
      );
    });
    this.projectService.getUserProjects().subscribe(
      (res) => {
        this.projects = res;
      },
      (error) => {
        console.log("here", error);
      }
    );
  }

  showConfirmation(index: number, id: ObjectId) {
    this.showDeleteConfirmation = true;
    this.projectIdToDelete = id;
    this.closeProjectDropdown(index);
    this.closeSidebar();
  }

  deleteProject() {
    this.projectService
      .deleteProject(this.projectIdToDelete!)
      .subscribe((res) => {
        this.projects = this.projects.filter(
          (pr) => pr._id !== this.projectIdToDelete
        );
        this.showDeleteConfirmation = false;
        this.projectEventService.emitProjectDeleted(this.projectIdToDelete!);
      });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  loadProject(pid: ObjectId) {
    this.router.navigate([`dashboard/project/${pid}`]);
    this.closeSidebar();
  }

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

  openProjectDropdown(index: number) {
    let dropdownId = "dropdown" + index;
    let dropdown = document.getElementById(dropdownId);
    dropdown?.classList.toggle("hidden");
  }

  closeProjectDropdown(index: number) {
    let dropdownId = "dropdown" + index;
    let dropdown = document.getElementById(dropdownId);
    dropdown?.classList.add("hidden");
  }

  toNewProject() {
    this.router.navigate(["/dashboard/new/project"]);
    this.closeSidebar();
  }

  toEditProject(index: number, id: ObjectId) {
    this.router.navigate([`/dashboard/edit/project/${id}`]);
    this.closeProjectDropdown(index);
  }
}
