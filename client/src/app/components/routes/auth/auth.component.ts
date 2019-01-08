import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {
  readonly usernameValidator = {
    minLength: 8,
    maxLength: 20
  };

  readonly passwordValidator = {
    minLength: 8,
    maxLength: 18,
    capitalLetters: 1,
    specialChars: 1
  };

  usernameField = new FormControl('', [
    Validators.minLength(this.usernameValidator.minLength),
    Validators.maxLength(this.usernameValidator.maxLength),
    Validators.required
  ]);

  passwordField = new FormControl('', [
    Validators.minLength(this.passwordValidator.minLength),
    Validators.maxLength(this.passwordValidator.maxLength),
    Validators.required,
    this.checkCapitalLetters(this.passwordValidator.capitalLetters),
    this.checkSpecialChars(this.passwordValidator.specialChars)
  ]);

  mode: 'Register' | 'Login' = 'Register';

  constructor() { }

  registerSelect() {
    this.mode = 'Register';
  }

  loginSelect() {
    this.mode = 'Login';
  }

  private checkCapitalLetters(min: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any | null} => {
      const letters = 'abcdefghijklmnopqrstuvwxyz1234567890';
      const input = control.value;
      let capitalCounter = 0;
      let enoughCaps = false;
      for (const char of input) {
        if (char.toUpperCase() === char && letters.indexOf(char.toLowerCase()) > -1) { capitalCounter++; }
        if (capitalCounter >= min) { enoughCaps = true; break; }
      }
      if (enoughCaps) { return null; }
      return {minCaps: {minCaps: min, actualCaps: capitalCounter}};
    };
  }

  private checkSpecialChars(min: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any | null} => {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '1234567890';
      const input = control.value;
      let specialCounter = 0;
      let enoughSpecial = false;
      for (const char of input) {
        if (letters.indexOf(char.toLowerCase()) < 0 && numbers.indexOf(char) < 0) { specialCounter++; }
        if (specialCounter >= min) { enoughSpecial = true; }
      }
      if (enoughSpecial) { return null; }
      return {minSpecial: {minSpecial: min, actualSpecial: specialCounter}};
    };
  }

  get usernameError() {
    if (this.usernameField.errors.minlength) {return `Username must be at least ${this.usernameValidator.minLength} characters long`; }
    if (this.usernameField.errors.maxlength) {return `Username must less than ${this.usernameValidator.maxLength + 1} characters long`; }
    return null;
  }

  get passwordError() {
    if (this.passwordField.errors.minlength) {return `Password must be at least ${this.passwordValidator.minLength} characters long`; }
    if (this.passwordField.errors.maxlength) {return `Password must less than ${this.passwordValidator.maxLength + 1} characters long`; }
    if (this.passwordField.errors.minCaps) {return `Password must have at least ${this.passwordValidator.capitalLetters} capital letters`; }
    if (this.passwordField.errors.minSpecial) {
      return `Password must have at least ${this.passwordValidator.specialChars} non alphabetic and non numeric characters`;
    }
    return null;
  }

  submit() {
    // register
  }

  ngOnInit() {}

}
