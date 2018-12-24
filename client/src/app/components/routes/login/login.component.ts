import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validator } from 'src/app/classes/validator';
import { MockApiService } from 'src/app/mocks/services/mock-api.service';
import { Observable } from 'rxjs';

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
  private $loginObserver: Observable<boolean>;

  constructor(private api: MockApiService) {}

  OnSubmit() {
    const usernameValid = this.validateUsername();
    const passwordValid = this.validatePassword();
    this.formValidated = true;
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

  ngOnInit() {}

}
