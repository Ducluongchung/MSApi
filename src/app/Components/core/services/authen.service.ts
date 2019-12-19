import { Injectable } from '@angular/core';
import { SystemConstants } from '../common/system.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggedInUser } from '../domain/loggedin.user';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  public user: LoggedInUser;
  
  constructor(private _http: HttpClient) {

  }
  get() {
    console.log(this.user);
  }

  Login(UserName: string, Password: string): Observable<any> {
    let credentials = 'username=' + UserName + '&password=' + Password + '&grant_type=password';
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this._http.post<any>(SystemConstants.BASE_API + '/api/oauth/token', encodeURI(credentials), { headers: reqHeader }).pipe(map(response => {
      this.user = response;
    }));
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
  }

  isUserAuthenticated(): boolean {
    let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user != null) {
      return true;
    }
    else
      return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser;
    if (this.isUserAuthenticated()) {
      var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      user = new LoggedInUser(userData.access_token,
        userData.username,
        userData.fullName,
        userData.email,
        userData.avatar, userData.roles, userData.permissions);
    }
    else
      user = null;
    return user;
  }

  checkAccess(functionId: string) {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var permission: any[] = JSON.parse(user.permissions);
    var roles: any[] = JSON.parse(user.roles);
    var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanRead == true);
    if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1) {
      return true;
    }
    else
      return false;
  }

  hasPermission(functionId: string, action: string): boolean {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var permission: any[] = JSON.parse(user.permissions);
    var roles: any[] = JSON.parse(user.roles);
    switch (action) {
      case 'create':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanCreate == true);
        if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
          result = true;
        break;
      case 'update':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanUpdate == true);
        if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
          result = true;
        break;
      case 'delete':
        var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanDelete == true);
        if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
          result = true;
        break;
    }
    return result;
  }
}
