import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  constructor() { }
  @Input() ProviderCreator: boolean;
  @Input() ApplicationName: string;
  @Input() Password: string;

  ngOnInit() {
  }

}
