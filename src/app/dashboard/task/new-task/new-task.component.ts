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
  @ViewChild("selectPriorityElem") selectPriorityElem!: ElementRef;
  @Input() pid: ObjectId | null = null;
  @Input() cid: ObjectId | null = null;
  @Input() taskID: ObjectId | null = null;

  taskForm: FormGroup;
  projects: Project[] = [];
  tomSelectProject!: TomSelect;
  tomSelectCategory!: TomSelect;
  tomSelectPriority!: TomSelect;

  constructor(
    private taskEventService: TaskEventService,
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService
  ) {
    this.taskForm = this.fb.group({
      body: ["", Validators.required],
      projectId: [""],
      categoryId: [""],
      priority: [0],
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
        this.taskService
          .updateTask(this.taskID, this.taskForm.value)
          .subscribe((res) => {
            this.taskEventService.emitTaskUpdated(res);
            this.closeTaskForm();
          });
      } else {
        const id = this.taskForm.value.categoryId
          ? this.taskForm.value.categoryId
          : this.taskForm.value.projectId;

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
          this.taskForm.controls["body"].setValue(res.body);

          if (res.projectId) {
            this.tomSelectProject.refreshOptions(false);
            this.tomSelectProject.setValue(res.projectId._id.toString());
          }
          if (res.categoryId) {
            this.tomSelectCategory.refreshOptions(false);
            this.tomSelectProject.setValue(res.categoryId.project.toString());
            this.tomSelectCategory.setValue(res.categoryId._id.toString());
          }
          if (res.priority) {
            this.tomSelectPriority.refreshOptions(false);
            this.tomSelectPriority.setValue(res.priority.toString());
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
        plugins: ["remove_button"],
      }
    );

    this.tomSelectCategory = new TomSelect(
      this.selectCategoryElem.nativeElement,
      {
        options: [],
        placeholder: "Select a category",
        plugins: ["remove_button"],
        maxItems: 1,
      }
    );

    this.tomSelectPriority = new TomSelect(
      this.selectPriorityElem.nativeElement,
      {
        options: [
          { value: 0, text: "P0", color: "text-gray-600" },
          { value: 1, text: "P1", color: "text-green-500" },
          { value: 2, text: "P2", color: "text-yellow-500" },
          { value: 3, text: "P3", color: "text-red-500" },
        ],
        items: ["0"],
        plugins: ["remove_button"],
        sortField: [
          {
            field: "text",
            direction: "desc",
          },
        ],
        render: {
          option: function (data: any, escape: any) {
            return `<div class= "flex flex-row">
          <svg class="w-6 h-6  ${
            data.color
          }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z"/>
          </svg>
          <p class="${data.color}">${escape(data.text)}</p>
          </div>
          `;
          },
          item: function (data: any, escape: any) {
            return `<div class= "flex flex-row space-x-2">
          <svg class="w-6 h-6  ${
            data.color
          }" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z"/>
          </svg>
          <p class="${data.color}">${escape(data.text)}</p>
          </div>`;
          },
        },
        placeholder: "Select a priority",
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
          value: cat._id,
          text: cat.name,
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
        project.categories?.some((cat) => cat._id === this.cid)
      );
      if (project) {
        this.tomSelectProject.setValue(project._id.toString());
        this.tomSelectCategory.setValue(this.cid.toString());
      }
    }
  }
}
