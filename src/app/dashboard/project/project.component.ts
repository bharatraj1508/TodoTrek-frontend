import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ObjectId } from "mongoose";
import { ProjectService } from "../../core/services/projectService/project.service";
import { Project } from "../../core/interface/project";
import { Task } from "../../core/interface/task";
import { Category } from "../../core/interface/category";
import { ProjectEventService } from "../../core/services/sharedServices/project-event.service";
import { TaskEventService } from "../../core/services/sharedServices/task-event.service";
import { TaskService } from "../../core/services/taskService/task.service";
import { CategoryService } from "../../core/services/categoryService/category.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

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
  showNewTaskForm: boolean = false;
  pid: ObjectId | null = null;
  cid: ObjectId | null = null;
  showDeleteConfirmation: boolean = false;
  taskId: ObjectId | null = null;
  toggleDropdown: boolean = false;
  categoryForm: FormGroup;
  editCatName: string = "";
  deleteId: ObjectId | null = null;
  deletedSource: "project" | "category" | "task" | null = null;
  index: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private projectEventService: ProjectEventService,
    private taskEventService: TaskEventService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ["", Validators.required],
    });

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
    this.taskEventService.taskClosed$.subscribe((val) => {
      if (val) {
        this.showNewTaskForm = false;
        this.pid = null;
        this.cid = null;
        this.taskId = null;
      }
    });
    this.taskEventService.taskCreated$.subscribe((val) => {
      if (val) {
        this.loadProject();
        this.pid = null;
        this.cid = null;
      }
    });
    this.taskEventService.taskUpdated$.subscribe((val) => {
      if (val) {
        this.loadProject();
        this.taskId = null;
        this.pid = null;
        this.cid = null;
      }
    });
  }

  loadProject() {
    if (this.projectId) {
      this.projectService.getSingleProject(this.projectId).subscribe(
        (res) => {
          this.project = res;
          this.projectTasks = res.tasks || [];
          this.projectCategory = res.categories || [];
        },
        (err) => {
          this.router.navigate(["/dashboard/home"]);
        }
      );
    }
  }

  markCompleted(id: ObjectId, checked: boolean) {
    this.taskService.changeTaskComplettion(id, checked).subscribe((res) => {
      this.loadProject();
    });
  }

  setPriorityColor(priority: number) {
    switch (priority) {
      case 1:
        return "text-green-500";
      case 2:
        return "text-yellow-500";
      case 3:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  }

  newCategory() {
    const category: Object = {
      name: "new category",
    };

    this.toggleDropdown = false;

    this.categoryService
      .createCategory(category, this.project!._id)
      .subscribe((res) => {
        this.loadProject();
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 300);
      });
  }

  editProject() {
    this.router.navigate([`/dashboard/edit/project/${this.project!._id}`]);
  }

  editCategoryName(i: number, name: string) {
    document
      .getElementById(`categoryNameInput${i}`)
      ?.classList.toggle("hidden");
    document.getElementById(`categoryName${i}`)?.classList.add("hidden");
    document.getElementById(`categoryDropdown${i}`)?.classList.add("hidden");
    document
      .getElementById(`categoryDropdownArrow${i}`)
      ?.classList.add("hidden");
    this.categoryForm.controls["categoryName"].setValue(name);
  }

  cancelEditCategory(id: number) {
    document.getElementById(`categoryNameInput${id}`)?.classList.add("hidden");
    document.getElementById(`categoryName${id}`)?.classList.remove("hidden");

    document
      .getElementById(`categoryDropdownArrow${id}`)
      ?.classList.remove("hidden");
  }

  updateCatName(id: ObjectId, index: number) {
    const cat = {
      name: this.categoryForm.value.categoryName,
    };
    this.categoryService.updateCategory(cat, id).subscribe((res) => {
      this.cancelEditCategory(index);
      this.loadProject();
    });
  }

  categoryDropdown(i: number) {
    document.getElementById(`categoryDropdown${i}`)?.classList.toggle("hidden");
  }

  newTaskForm(id: ObjectId | null, taskFor: "project" | "category" | "task") {
    switch (taskFor) {
      case "project":
        this.pid = id ? id : null;
        break;
      case "category":
        this.cid = id ? id : null;
        break;
      case "task":
        this.taskId = id ? id : null;
        break;
    }
    this.showNewTaskForm = true;
    this.toggleDropdown = false;
  }

  deleteProject() {
    this.projectService.deleteProject(this.project!._id!).subscribe((res) => {
      this.pid = null;
      this.cid = null;
      this.taskId = null;
      this.deleteId = null;
      this.deletedSource = null;
      this.index = null;
      this.projectTasks = [];
      this.projectCategory = [];
      this.projectId = null;
      this.showDeleteConfirmation = false;
      this.projectEventService.emitProjectDeleted(this.project!._id);
      this.project = null;
      this.router.navigate(["/dashboard/home"]);
    });
  }

  deleteCategory(id: ObjectId, index: number) {
    this.categoryService.deleteCategory(id).subscribe((res) => {
      document
        .getElementById(`categoryDropdown${index}`)
        ?.classList.add("hidden");
      this.showDeleteConfirmation = false;
      this.loadProject();
    });
  }

  deleteTask(id: ObjectId) {
    this.taskService.deleteTask(id).subscribe((res) => {
      this.taskId = null;
      this.loadProject();
      this.showDeleteConfirmation = false;
    });
  }

  deleteConfirmation(
    id: ObjectId,
    deletedSource: "project" | "category" | "task",
    index?: number
  ) {
    this.deleteId = id;
    this.showDeleteConfirmation = true;
    this.deletedSource = deletedSource;
    this.index = index ? index : null;
    document
      .getElementById(`categoryDropdown${index}`)
      ?.classList.add("hidden");
  }

  deleteConfirm() {
    switch (this.deletedSource) {
      case "task":
        this.deleteTask(this.deleteId!);
        break;
      case "category":
        this.deleteCategory(this.deleteId!, this.index!);
        break;
      case "project":
        this.deleteProject();
        break;
    }
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.taskId = null;
  }
}
