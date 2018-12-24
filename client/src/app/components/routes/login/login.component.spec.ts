import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {generate} from 'randomstring';
import { Validator } from 'src/app/classes/validator';
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should warn user if username input is to short', () => {
    const usernameInput: HTMLInputElement = fixture.nativeElement.querySelector('#usernameInput');
    let usernameInputStyle: string;
    let usernameInputStyleList: string[];
    let validationOutput: HTMLDivElement;
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    usernameInput.value = generate(Validator.UsernameMinLength - 1);
    submitButton.click();
    fixture.detectChanges();
    validationOutput = fixture.nativeElement.querySelector('#failedUsernameValidation');
    // get string of all css classes
    usernameInputStyle = usernameInput.className;
    // create array of classes and check for index of is-invalid
    // is-invalid is css to change input color to red
    usernameInputStyleList = usernameInputStyle.split(' ');
    expect(usernameInputStyleList.indexOf('is-invalid')).toBeGreaterThan(-1);
    // makes sure the validation text is displayed
    expect(validationOutput).toBeTruthy();
  });

  it('Should warn user if username input is to long', () => {
    const usernameInput: HTMLInputElement = fixture.nativeElement.querySelector('#usernameInput');
    let usernameInputStyle: string;
    let usernameInputStyleList: string[];
    let validationOutput: HTMLDivElement;
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    usernameInput.value = generate(Validator.UsernameMaxLength + 1);
    submitButton.click();
    fixture.detectChanges();
    validationOutput = fixture.nativeElement.querySelector('#failedUsernameValidation');
    // get string of all css classes
    usernameInputStyle = usernameInput.className;
    // create array of classes and check for index of is-invalid
    // is-invalid is css to change input color to red
    usernameInputStyleList = usernameInputStyle.split(' ');
    expect(usernameInputStyleList.indexOf('is-invalid')).toBeGreaterThan(-1);
    // makes sure the validation text is displayed
    expect(validationOutput).toBeTruthy();
  });

  xit('Should show user if username input was valid', () => {
    const usernameInput: HTMLInputElement = fixture.nativeElement.querySelector('#usernameInput');
    let usernameInputStyle: string;
    let usernameInputStyleList: string[];
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    usernameInput.value = generate({
      length: Validator.UsernameMaxLength,
      charset: 'alphanumeric'
    });
    console.log(usernameInput.value);
    submitButton.click();
    fixture.detectChanges();
    // get string of all css classes
    usernameInputStyle = usernameInput.className;
    // create array of classes and check for index of is-valid
    // is-valid is css to change input color to green
    usernameInputStyleList = usernameInputStyle.split(' ');
    console.log(usernameInputStyleList);
    expect(usernameInputStyleList.indexOf('is-valid')).toBeGreaterThan(-1);
  });

  it('Should warn user if password input is to short', () => {
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#passwordInput');
    let passwordInputStyle: string;
    let passwordInputStyleList: string[];
    let validationOutput: HTMLDivElement;
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    passwordInput.value = generate(Validator.PasswordMinLength - 1);
    submitButton.click();
    fixture.detectChanges();
    validationOutput = fixture.nativeElement.querySelector('#failedPasswordValidation');
    // get string of all css classes
    passwordInputStyle = passwordInput.className;
    // create array of classes and check for index of is-invalid
    // is-invalid is css to change input color to red
    passwordInputStyleList = passwordInputStyle.split(' ');
    expect(passwordInputStyleList.indexOf('is-invalid')).toBeGreaterThan(-1);
    // makes sure the validation text is displayed
    expect(validationOutput).toBeTruthy();
  });

  it('Should warn user if password input is to long', () => {
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#passwordInput');
    let passwordInputStyle: string;
    let passwordInputStyleList: string[];
    let validationOutput: HTMLDivElement;
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    passwordInput.value = generate(Validator.PasswordMaxLength + 1);
    submitButton.click();
    fixture.detectChanges();
    validationOutput = fixture.nativeElement.querySelector('#failedPasswordValidation');
    // get string of all css classes
    passwordInputStyle = passwordInput.className;
    // create array of classes and check for index of is-invalid
    // is-invalid is css to change input color to red
    passwordInputStyleList = passwordInputStyle.split(' ');
    expect(passwordInputStyleList.indexOf('is-invalid')).toBeGreaterThan(-1);
    // makes sure the validation text is displayed
    expect(validationOutput).toBeTruthy();
  });

  it('Should warn user if password input does not have enough capital letters', () => {
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#passwordInput');
    let passwordInputStyle: string;
    let passwordInputStyleList: string[];
    let validationOutput: HTMLDivElement;
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    passwordInput.value = generate({
      length: Validator.PasswordMaxLength,
      capitalization: 'lowercase'
    });
    submitButton.click();
    fixture.detectChanges();
    validationOutput = fixture.nativeElement.querySelector('#failedPasswordValidation');
    // get string of all css classes
    passwordInputStyle = passwordInput.className;
    // create array of classes and check for index of is-invalid
    // is-invalid is css to change input color to red
    passwordInputStyleList = passwordInputStyle.split(' ');
    expect(passwordInputStyleList.indexOf('is-invalid')).toBeGreaterThan(-1);
    // makes sure the validation text is displayed
    expect(validationOutput).toBeTruthy();
  });

  it('Should warn user if password input does not have enough special chars', () => {
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#passwordInput');
    let passwordInputStyle: string;
    let passwordInputStyleList: string[];
    let validationOutput: HTMLDivElement;
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    passwordInput.value = generate({
      length: Validator.PasswordMaxLength,
      capitalization: 'uppercase',
      charset: 'hex'
    });
    submitButton.click();
    fixture.detectChanges();
    validationOutput = fixture.nativeElement.querySelector('#failedPasswordValidation');
    // get string of all css classes
    passwordInputStyle = passwordInput.className;
    // create array of classes and check for index of is-invalid
    // is-invalid is css to change input color to red
    passwordInputStyleList = passwordInputStyle.split(' ');
    expect(passwordInputStyleList.indexOf('is-invalid')).toBeGreaterThan(-1);
    // makes sure the validation text is displayed
    expect(validationOutput).toBeTruthy();
  });

  xit('Should show user if password input was valid', () => {
    const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#passwordInput');
    let passwordInputStyle: string;
    let passwordInputStyleList: string[];
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('#submit');
    passwordInput.value = generate({
      length: Validator.PasswordMaxLength,
      charset: '!@#$%^&*()',
      capitalization: 'uppercase'
    });
    submitButton.click();
    fixture.detectChanges();
    // get string of all css classes
    passwordInputStyle = passwordInput.className;
    // create array of classes and check for index of is-invalid
    // is-valid is css to change input color to green
    passwordInputStyleList = passwordInputStyle.split(' ');
    expect(passwordInputStyleList.indexOf('is-valid')).toBeGreaterThan(-1);
  });
});
