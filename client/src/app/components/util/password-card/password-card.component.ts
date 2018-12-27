import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validator } from 'src/app/classes/validator';
import { MockApiService } from 'src/app/mocks/services/mock-api.service';
import { IPasswordProvider } from 'src/app/classes/user';
import { ClipboardService } from 'ngx-clipboard'

export interface IPasswordCardInput {
  providerCreator?: boolean;
  applicationName?: string;
  password?: string;
}

@Component({
  selector: 'app-password-card',
  templateUrl: './password-card.component.html',
  styleUrls: ['./password-card.component.css']
})
export class PasswordCardComponent implements OnInit {
  private form = new FormGroup({
    providerName: new FormControl(''),
    password: new FormControl('')
  });
  private errorMessage = null;
  private showPassword = false;
  private buttonText = 'Show Password';
  constructor(private api: MockApiService, private clip: ClipboardService) { }
  @Input() ProviderCreator: boolean;
  @Input() ApplicationName: string;
  @Input() Password: string;
  @Output() ProviderEvent = new EventEmitter<IPasswordProvider[]>();

  OnSubmit() {
    const providerName = this.form.value['providerName'];
    const password = this.form.value['password'];
    const isNameValid = Validator.ValidateProviderNameInput(providerName);
    const isPasswordValid = Validator.ValidateProviderPasswordInput(password);
    if (!isNameValid) {this.errorMessage = 'provider name can not be empty'; return;}
    if (!isPasswordValid) {this.errorMessage = 'provider password can not be empty'; return;}
    this.api.newProvider({password, applicationName: providerName}).subscribe(
      (providers) => {
        console.log(providers);
        this.ProviderEvent.emit(providers);
      },
      (err) => {this.errorMessage = err.message}
    )
  }

  ToggleShow() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {this.buttonText = 'Hide Password'}
    if (!this.showPassword) {this.buttonText = 'Show Password'}
  }

  CopyPassword() {
    this.clip.copyFromContent(this.Password);
  }

  ngOnInit() {
  }

}
