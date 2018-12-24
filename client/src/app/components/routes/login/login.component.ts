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
  private loadingMessage = null;

  constructor() { }

  OnSubmit() {
    const usernameValid = this.validateUsername();
    const passwordValid = this.validatePassword();
    this.formValidated = true;
    if (usernameValid && passwordValid) {
      this.loadingMessage = 'Logging you in please wait';
    }
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

  private validatePassword() {
    const passwordValidateResult = Validator.ValidatePassword(this.loginForm.value['password']);
    if (passwordValidateResult.reason) {
      this.passwordValidationMessage = passwordValidateResult.reason;
      return false;
    } else {
      this.passwordValidationMessage = null;
      return true;
    }
  }

  ngOnInit() {
  }

}
