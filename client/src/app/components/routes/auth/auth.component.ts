import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonToggle } from '@angular/material/button-toggle';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {
  usernameField = new FormControl('');
  passwordField = new FormControl('');
  mode: 'Register' | 'Login' = 'Register';

  constructor() { }

  registerSelect() {
    this.mode = 'Register';
  }

  loginSelect() {
    this.mode = 'Login';
  }

  ngOnInit() {}

}
