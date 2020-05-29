import {Router} from '@angular/router';
import {environment} from './../../../environments/environment';
import {User} from './../models/User';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  jwtHealper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/V4.1/users/login`, {username, password})
      .pipe(map(user => {
        const newUser = {
          id: user.data.id,
          username: user.data.attributes.userName,
          token: user.meta.token
        };
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        return newUser;
      }));
  }

  loggedIn() {
    const user: User = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      return !this.jwtHealper.isTokenExpired(user.token);
    }
    return false;

  }

  getToken() {
    if (this.loggedIn()) {
      const user: User = JSON.parse(localStorage.getItem('currentUser'));
      return user.token;
    }
    return null;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }
}
