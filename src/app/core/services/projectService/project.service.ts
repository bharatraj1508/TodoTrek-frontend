import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { Environment } from "../../environment";
import { Project } from "../../interface/project";
import { ObjectId } from "mongoose";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private url = Environment.apiUrl;
  headers = new HttpHeaders().set("Content-Type", "application/json");
  constructor(private http: HttpClient, private router: Router) {}

  getUserProjects(sort?: string): Observable<Project[]> {
    let api = `${this.url}/project/user?${sort ? `sort=${sort}` : ""}`;
    return this.http.get<Project[]>(api);
  }

  getSingleProject(id: ObjectId, sort?: string): Observable<Project> {
    let api = `${this.url}/project/${id}?${sort ? `sort=${sort}` : ""}`;
    return this.http.get<Project>(api);
  }

  createProject(project: Project): Observable<Project> {
    let api = `${this.url}/project/create`;
    return this.http.post<Project>(api, project);
  }

  updateProject(id: ObjectId, project: Project): Observable<Project> {
    let api = `${this.url}/project/${id}`;
    return this.http.patch<Project>(api, project, { headers: this.headers });
  }

  deleteProject(id: ObjectId): Observable<any> {
    let api = `${this.url}/project/${id}`;
    return this.http.delete(api);
  }
}
