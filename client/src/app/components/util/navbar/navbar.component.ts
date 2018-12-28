import { Component, OnInit } from '@angular/core';
import { MockApiService } from 'src/app/mocks/services/mock-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private navbarOpen = false;
  private usersDropdownOpen = false;
  private userLoggedIn = false;
  private message = null;

  constructor(private api: MockApiService, private router: Router) { }

  get NavbarOpen() {
    return this.navbarOpen;
  }

  get UsersDropdownOpen() {
    return this.usersDropdownOpen;
  }

  NavbarToggle() {
    this.navbarOpen = !this.navbarOpen;
  }

  UsersToggle() {
    this.usersDropdownOpen = !this.usersDropdownOpen;
  }

  Logout() {
    this.api.Logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
    if (this.api.HasApiKey()) {this.userLoggedIn = true; }
    this.api.AuthSubject.subscribe({
      next: data => {
        if (data === 'login') {this.userLoggedIn = true; }
        if (data === 'logout') {this.userLoggedIn = false; }
      }
    });
  }

}
