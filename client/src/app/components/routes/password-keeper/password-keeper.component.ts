import { Component, OnInit } from '@angular/core';
import { MockApiService } from 'src/app/mocks/services/mock-api.service';
import { IPasswordProvider } from 'src/app/classes/user';

@Component({
  selector: 'app-password-keeper',
  templateUrl: './password-keeper.component.html',
  styleUrls: ['./password-keeper.component.css']
})
export class PasswordKeeperComponent implements OnInit {
  private loading = true;
  private providers: IPasswordProvider[];
  private error = null;

  constructor(private api: MockApiService) {}

  ngOnInit() {
    this.api.GetUser().subscribe(
      user => {
        this.providers = user.Providers;
        this.loading = false;
      },
      err => {
        this.error = err.message;
        this.loading = false;
      }
    );
  }

  OnProvider($event: any) {
    this.providers = $event;
  }
}
