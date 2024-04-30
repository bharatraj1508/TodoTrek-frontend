import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { TaskEventService } from "../../../core/services/sharedServices/task-event.service";
import { ObjectId } from "mongoose";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TaskService } from "../../../core/services/taskService/task.service";
import TomSelect from "tom-select";
import { ProjectService } from "../../../core/services/projectService/project.service";
import { Project } from "../../../core/interface/project";

@Component({
  selector: "app-new-task",
  templateUrl: "./new-task.component.html",
  styleUrl: "./new-task.component.css",
})
export class NewTaskComponent implements AfterViewInit {
  @ViewChild("selectProjectElem") selectProjectElem!: ElementRef;
  @ViewChild("selectCategoryElem") selectCategoryElem!: ElementRef;
  @Input() pid: ObjectId | null = null;
  @Input() cid: ObjectId | null = null;
  @Input() taskID: ObjectId | null = null;

  taskForm: FormGroup;
  projects: Project[] = [];
  tomSelectProject!: TomSelect;
  tomSelectCategory!: TomSelect;

  constructor(
    private taskEventService: TaskEventService,
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService
  ) {
    this.taskForm = this.fb.group({
      body: ["", Validators.required],
      project: [""],
      category: [""],
    });
  }

  closeTaskForm() {
    this.pid = null;
    this.cid = null;
    this.taskID = null;
    this.tomSelectCategory.clear();
    this.tomSelectProject.clear();
    this.tomSelectCategory.clearOptions();
    this.tomSelectProject.clearOptions();
    this.taskEventService.emitTaskClosed(true);
  }

  createTask() {
    if (this.taskForm.valid) {
      if (this.taskID) {
        console.log("update");
      } else {
        const id = this.taskForm.value.category
          ? this.taskForm.value.category
          : this.taskForm.value.project;

        this.taskService
          .createTasks(this.taskForm.value, id)
          .subscribe((res) => {
            this.taskEventService.emitTaskCreated(res);
            this.closeTaskForm();
          });
      }
    }
  }

  ngAfterViewInit(): void {
    this.projectService.getUserProjects().subscribe((res) => {
      this.projects = res;
      this.initializeTomSelect();
      this.setOptions();
      if (this.taskID) {
        this.taskService.getSingleTask(this.taskID).subscribe((res) => {
          this.taskForm.controls["body"].setValue(res.task.body);

          if (res.task.projectId) {
            this.tomSelectProject.refreshOptions(false);
            this.tomSelectProject.setValue(res.task.projectId._id.toString());
          }
          if (res.task.categoryId) {
            this.tomSelectCategory.refreshOptions(false);
            this.tomSelectProject.setValue(
              res.task.categoryId.project.toString()
            );
            this.tomSelectCategory.setValue(res.task.categoryId._id.toString());
          }
        });
      }
    });
  }

  initializeTomSelect() {
    this.tomSelectProject = new TomSelect(
      this.selectProjectElem.nativeElement,
      {
        options: [],
        placeholder: "Select a project",
      }
    );

    this.tomSelectCategory = new TomSelect(
      this.selectCategoryElem.nativeElement,
      {
        options: [],
        placeholder: "Select a category",
      }
    );
  }

  setOptions() {
    const projectOptions = this.projects.map((project) => ({
      value: project._id,
      text: project.name,
    }));
    var categoryOptions: { value: ObjectId; text: string }[] = [];

    this.tomSelectProject.addOptions(projectOptions);

    this.tomSelectProject["on"]("change", (selectedProjectId: ObjectId) => {
      this.tomSelectCategory.clear();
      this.tomSelectCategory.clearOptions();
      const selectedProject = this.projects.find(
        (project) => project._id === selectedProjectId
      );
      if (selectedProject && selectedProject.categories) {
        categoryOptions = selectedProject.categories.map((cat) => ({
          value: cat.category._id,
          text: cat.category.name,
        }));

        this.tomSelectCategory.clearOptions();
        this.tomSelectCategory.addOptions(categoryOptions);
        this.tomSelectCategory.refreshOptions(false);
      }
    });

    if (this.pid) {
      this.tomSelectProject.setValue(this.pid.toString());
    } else if (this.cid) {
      const project = this.projects.find((project) =>
        project.categories?.some((cat) => cat.category._id === this.cid)
      );
      if (project) {
        this.tomSelectProject.setValue(project._id.toString());
        this.tomSelectCategory.setValue(this.cid.toString());
      }
    }
  }
}
