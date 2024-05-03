import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Task } from "../../interface/task";

@Injectable({
  providedIn: "root",
})
export class TaskEventService {
  private closeTaskFormSource = new Subject<Boolean>();
  private taskCreatedSource = new Subject<Task>();
  private taskUpdatedSource = new Subject<Task>();

  taskClosed$ = this.closeTaskFormSource.asObservable();
  taskCreated$ = this.taskCreatedSource.asObservable();
  taskUpdated$ = this.taskUpdatedSource.asObservable();

  emitTaskClosed(val: Boolean) {
    this.closeTaskFormSource.next(val);
  }

  emitTaskCreated(val: Task) {
    this.taskCreatedSource.next(val);
  }

  emitTaskUpdated(val: Task) {
    this.taskUpdatedSource.next(val);
  }
}
