import { Injectable } from '@angular/core';
import { User, IPasswordProvider } from 'src/app/classes/user';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  public User: User | null = null;
  public ApiKey: string | null = null;
  public ValidNextRequest = true;
  public TimeToExe = 1000;
  public AuthSubject: Subject<'login' | 'logout'> = new Subject();
  constructor() { }

  HasApiKey() {
    if (this.ApiKey) {return true; }
    return false;
  }

  AuthListener() {return this.AuthSubject; }

  newProvider(provider: IPasswordProvider) {
    return new Observable<IPasswordProvider[]>((observer) => {
      setTimeout(() => {
        if (this.ValidNextRequest) {
          this.User.AddProvider(provider);
          observer.next(this.User.Providers);
        } else {
          observer.error('Some random error has occurred');
        }
      }, 1000);
    });
  }

  GetUser() {
    return new Observable<User>((observer) => {
      if (this.User) {return observer.next(this.User); }
      setTimeout(() => {
        if (this.ValidNextRequest && this.ApiKey) {
          this.User = new User({username: 'testtest', id: '1234', passwordProviders: []});
          observer.next(this.User);
        } else if (this.ValidNextRequest && !this.ApiKey) {
          observer.error(new Error('You are not logged in'));
        } else {
          observer.error(new Error('Mock request error'));
        }
      }, this.TimeToExe);
    });
  }

  Login() {
    return new Observable((observer) => {
      setTimeout(() => {
        if (this.ValidNextRequest) {
          this.AuthSubject.next('login');
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

  Logout() {
    this.AuthSubject.next('logout');
    this.ApiKey = null;
  }

  Register() {
    return new Observable((observer) => {
      setTimeout(() => {
        if (this.ValidNextRequest) {
          this.AuthSubject.next('login');
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
