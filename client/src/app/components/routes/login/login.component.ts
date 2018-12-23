import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validator } from 'src/app/classes/validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  private usernameValidationMessage = null;
  private passwordValidationMessage = null;
  private formValidated = false;

  constructor() { }

  OnSubmit() {
    const usernameValid = this.validateUsername();
    this.formValidated = true;
  }

  private validateUsername() {
    const usernameValidationResult = Validator.ValidateUsername(this.loginForm.value['username']);
    if (usernameValidationResult.reason) {
      this.usernameValidationMessage = usernameValidationResult.reason;
      return false;
    } else {
      this.usernameValidationMessage = null;
      return true;
    }
  }

  ngOnInit() {
  }

}
