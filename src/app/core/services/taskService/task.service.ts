import { Injectable } from "@angular/core";
import { Environment } from "../../environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ObjectId } from "mongoose";
import { Task } from "../../interface/task";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private url = Environment.apiUrl;
  headers = new HttpHeaders().set("Content-Type", "application/json");
  constructor(private http: HttpClient, private router: Router) {}

  createTasks(task: Task, id: ObjectId | null): Observable<Task> {
    let api = `${this.url}/task/create?id=${id}`;

    return this.http.post<Task>(api, task, {
      headers: this.headers,
    });
  }

  deleteTask(id: ObjectId): Observable<any> {
    let api = `${this.url}/task/${id}`;

    return this.http.delete<any>(api, {
      headers: this.headers,
    });
  }

  updateTask(id: ObjectId, task: Task): Observable<Task> {
    let api = `${this.url}/task/${id}`;

    return this.http.patch<Task>(api, task, {
      headers: this.headers,
    });
  }

  getSingleTask(id: ObjectId): Observable<any> {
    let api = `${this.url}/task/${id}`;

    return this.http.get<any>(api, {
      headers: this.headers,
    });
  }

  changeTaskComplettion(id: ObjectId, isCompleted: boolean): Observable<Task> {
    let api = `${this.url}/task/change-completion/${id}`;

    return this.http.patch<Task>(
      api,
      { isCompleted },
      {
        headers: this.headers,
      }
    );
  }
}
