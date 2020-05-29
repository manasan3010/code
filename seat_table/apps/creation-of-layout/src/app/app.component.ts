import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SeatTable';
  jwtHealper = new JwtHelperService();

  constructor(private userService: UserService) {
  }
  ngOnInit() {
    const token = this.userService.getToken();
    if (this.jwtHealper.isTokenExpired(token)) {
      this.userService.logout();
    }
  }
}
