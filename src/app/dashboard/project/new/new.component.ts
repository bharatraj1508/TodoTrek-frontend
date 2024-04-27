import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "../../../core/services/projectService/project.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import TomSelect from "tom-select";
import { ProjectEventService } from "../../../core/services/sharedServices/project-event.service";
import { ObjectId } from "mongoose";

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrl: "./new.component.css",
})
export class NewComponent implements AfterViewInit {
  @ViewChild("selectElem") selectElem!: ElementRef;
  message: string = "";
  hasError: boolean = false;
  projectId: ObjectId | null = null;
  projectForm: FormGroup;
  edit: Boolean = false;
  success: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public projectService: ProjectService,
    public projectEventService: ProjectEventService
  ) {
    this.projectForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      color: new FormControl("", [Validators.required]),
      favourites: new FormControl(false),
    });

    this.route.params.subscribe((params) => {
      if (params["pid"]) {
        this.projectId = params["pid"];
        this.getProject();
      }
    });
  }

  getProject() {
    if (this.projectId) {
      this.projectService.getSingleProject(this.projectId).subscribe(
        (res) => {
          this.projectForm.patchValue(res);
          if (this.selectElem && this.selectElem.nativeElement.tomselect) {
            this.selectElem.nativeElement.tomselect.setValue(res.color);
          }
          this.edit = true;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  submitProject() {
    if (this.edit) {
      if (this.projectForm.valid) {
        this.projectService
          .updateProject(this.projectId!, this.projectForm.value)
          .subscribe({
            next: (res) => {
              this.message = "Project updated successfully";
              this.success = true;
              this.projectEventService.emitProjectUpdated(res);
            },
            error: (err) => {
              this.message = err.error.message;
              this.hasError = true;
            },
          });
      } else {
        this.message = "";
        this.projectForm.markAllAsTouched();
      }
    } else {
      if (this.projectForm.valid) {
        this.projectService.createProject(this.projectForm.value).subscribe({
          next: (res) => {
            // emit the newly created project to the sidebar using the shared service
            this.projectEventService.emitProjectCreated(res);

            this.router.navigateByUrl(`/dashboard/project/${res._id}`);
          },
          error: (err) => {
            this.message = err.error.message;
            this.hasError = true;
          },
        });
      } else {
        this.message = "";
        this.projectForm.markAllAsTouched();
      }
    }
  }

  getFormControlError(controlName: string): string {
    const control = this.projectForm.get(controlName);
    if (control && control.touched && control.errors) {
      if (control.errors["required"]) {
        return "This field is required";
      }
    }
    return "";
  }

  ngAfterViewInit(): void {
    new TomSelect(this.selectElem.nativeElement, {
      plugins: ["remove_button"],
      allowEmptyOption: true,
      placeholder: "Select",
      sortField: [
        {
          field: "text",
          direction: "asc",
        },
      ],
      options: [
        { value: "#FFC55A", text: "Amber" },
        { value: "#B5C18E", text: "Olive Green" },
        { value: "#E4C59E", text: "Pale Apricot" },
        { value: "#803D3B", text: "Burgundy" },
        { value: "#E55604", text: "Cinnabar" },
        { value: "#86469C", text: "Deep Violet" },
        { value: "#90D26D", text: "Spring Green" },
        { value: "#F78FA7", text: "Carmine Pink" },
        { value: "#008DDA", text: "Cerulean" },
        { value: "#D0A2F7", text: "Pale Purple" },
      ],
      render: {
        option: function (data: any, escape: any) {
          return (
            "<div>" +
            '<span style="display:inline-block; width:12px; height:12px; background-color:' +
            escape(data.value) +
            '; margin-right: 5px;"></span>' +
            '<span class="title">' +
            escape(data.text) +
            "</span>" +
            "</div>"
          );
        },
        item: function (data: any, escape: any) {
          return (
            '<div title="' +
            escape(data.value) +
            '">' +
            '<span style="display:inline-block; width:12px; height:12px; background-color:' +
            escape(data.value) +
            '; margin-right: 5px;"></span>' +
            escape(data.text) +
            "</div>"
          );
        },
      },
    });
  }
}
