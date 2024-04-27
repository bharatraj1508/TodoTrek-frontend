import { Injectable, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Project } from "../../interface/project";
import { ObjectId } from "mongoose";

@Injectable({
  providedIn: "root",
})

/* The purpose of creating thsi shared service is to 
 update the sidebar with the newly created project

 here we are using the Subject(observerable) to emit the newly created project
 once it is created we are providing it to its observer(sidebar)
 */
export class ProjectEventService {
  private projectCreatedSource = new Subject<Project>();
  private projectUpdatedSource = new Subject<Project>();
  private projectDeletedSource = new Subject<ObjectId>();

  projectCreated$ = this.projectCreatedSource.asObservable();
  projectUpdated$ = this.projectUpdatedSource.asObservable();
  projectDeleted$ = this.projectDeletedSource.asObservable();

  emitProjectCreated(project: Project) {
    this.projectCreatedSource.next(project);
  }

  emitProjectUpdated(project: Project) {
    this.projectUpdatedSource.next(project);
  }

  emitProjectDeleted(projectId: ObjectId) {
    this.projectDeletedSource.next(projectId);
  }
}
