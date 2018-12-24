import { Injectable } from '@angular/core';
import { User } from 'src/app/classes/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  public User: User | null = null;
  public ApiKey: string | null = null;
  public ValidNextRequest = true;
  public TimeToExe = 1000;
  constructor() { }

  Login() {
    return new Observable<boolean>((observer) => {
      setTimeout(() => {
        if (this.ValidNextRequest) {
          this.ApiKey = 'testApiKey';
          // next(true);
          observer.complete();
        } else {
          observer.error(new Error('Login Error'));
          // complete();
        }
      }, this.TimeToExe);
    });
  }

}
