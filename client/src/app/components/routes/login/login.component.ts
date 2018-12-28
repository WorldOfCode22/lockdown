import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validator } from 'src/app/classes/validator';
import { MockApiService } from 'src/app/mocks/services/mock-api.service';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

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
  private apiMessage = null;
  private register = false;
  private formName = 'Login';

  constructor(private api: MockApiService, private router: Router, private location: Location) {}

  OnSubmit() {
    const usernameValid = this.validateUsername();
    const passwordValid = this.validatePassword();
    this.formValidated = true;
    if (!this.register) {
      this.login(usernameValid, passwordValid);
    } else {
      this.goRegister(usernameValid, passwordValid);
    }
  }

  private login(usernameValid: boolean, passwordValid: boolean) {
    if (usernameValid && passwordValid) {
      this.loadingMessage = 'Logging you in please wait';
      this.api.Login().subscribe({
        error: (err) => {
          this.loadingMessage = null;
          this.apiMessage = err.message;
        },
        complete: () => {
          this.loadingMessage = null;
          this.apiMessage = 'Logged in';
        }
      });
    }
  }

  private goRegister(usernameValid: boolean, passwordValid: boolean) {
    if (usernameValid && passwordValid) {
      this.loadingMessage = 'Registering you please wait';
      this.api.Register().subscribe({
        error: (err) => {
          this.loadingMessage = null;
          this.apiMessage = err.message;
        },
        complete: () => {
          this.loadingMessage = null;
          this.apiMessage = 'Registered and Logged in';
        }
      });
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.location.path() === '/register') {
          this.register = true;
          this.formName = 'Register';
        }
      }
    });
    if (this.location.path() === '/register') {
      this.register = true;
      this.formName = 'Register';
    }
  }

}
