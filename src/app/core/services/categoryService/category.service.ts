import { Injectable } from "@angular/core";
import { Environment } from "../../environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ObjectId } from "mongoose";
import { Category } from "../../interface/category";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private url = Environment.apiUrl;
  headers = new HttpHeaders().set("Content-Type", "application/json");
  constructor(private http: HttpClient, private router: Router) {}

  createCategory(category: Object, id: ObjectId): Observable<Category> {
    return this.http.post<Category>(
      `${this.url}/category/create/${id}`,
      category,
      { headers: this.headers }
    );
  }

  updateCategory(category: Object, id: ObjectId): Observable<Category> {
    return this.http.patch<Category>(`${this.url}/category/${id}`, category, {
      headers: this.headers,
    });
  }

  deleteCategory(id: ObjectId): Observable<Category> {
    return this.http.delete<Category>(`${this.url}/category/${id}`, {
      headers: this.headers,
    });
  }
}
