import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private navbarOpen = false;
  private usersDropdownOpen = false;

  constructor() { }

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

  ngOnInit() {
  }

}
