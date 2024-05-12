import { Injectable } from "@angular/core";
import { Environment } from "../../environment";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError, catchError, Observable } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../../interface/user";

// this is for singing out the google accounts
declare var handleSignout: any;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = Environment.apiUrl;
  headers = new HttpHeaders().set("Content-Type", "application/json");
  constructor(private http: HttpClient, public router: Router) {}

  login(user: User) {
    return this.http
      .post<any>(`${this.url}/auth/sign_in`, user)
      .pipe(catchError(this.handleError));
  }

  googleSignin(googleUser: any) {
    return this.http
      .post<any>(`${this.url}/auth/register/google_account`, googleUser)
      .pipe(catchError(this.handleError));
  }

  register(userObj: any) {
    return this.http
      .post<any>(`${this.url}/auth/sign_up`, userObj)
      .pipe(catchError(this.handleError));
  }

  sendPasswordResetEmail(email: String) {
    return this.http
      .post<any>(`${this.url}/auth/user/send-password-reset`, email, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  resetPassword(passwordObj: any, token: String) {
    return this.http
      .put<any>(
        `${this.url}/auth/user/reset-password?token=${token}`,
        passwordObj
      )
      .pipe(catchError(this.handleError));
  }

  changePassword(passwordObj: any) {
    return this.http
      .patch<any>(`${this.url}/auth/user/change-password`, passwordObj)
      .pipe(catchError(this.handleError));
  }

  changeEmail(emailObj: any) {
    return this.http
      .patch<any>(`${this.url}/auth/user/change-email`, emailObj)
      .pipe(catchError(this.handleError));
  }

  verifyEmail(token: String) {
    return this.http
      .post<any>(`${this.url}/auth/email/verify?token=${token}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.url}/auth/current_user`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  doLogout(loginMessage?: string) {
    let removeToken = localStorage.removeItem("user-token");
    if (removeToken == null) {
      handleSignout();
      sessionStorage.removeItem("loggedInUser");
      this.router.navigate(["/login"], {
        state: { message: loginMessage },
      });
    }
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem("user-token");
    return authToken !== null ? true : false;
  }

  getToken() {
    return localStorage.getItem("user-token");
  }

  // Error
  handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error instanceof ErrorEvent) {
      return throwError(errorRes.error.message);
    } else if (errorRes.error instanceof ProgressEvent) {
      return throwError(errorRes);
    } else {
      return throwError(errorRes);
    }
  }
}
