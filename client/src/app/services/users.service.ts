import { Injectable } from '@angular/core';
import { ApiService, IUserInput } from './api.service';
import { User } from '../classes/user';
import { Observable } from 'rxjs';
import { Validator } from '../classes/validator';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user: User | null;
  loggedIn = false;
  validator = Validator();

  constructor(public api: ApiService) { }

  register(input: IUserInput) {
    const validateUsername = this.validator.validate(input.username, 'username', this.validator.username);
    let validatePassword: string | true;
    return new Observable<void>((observer) => {
      if (this.loggedIn) {
        observer.complete();
        observer.unsubscribe();
        return;
      }
      if (typeof(validateUsername) === 'string') {
        observer.error(validateUsername);
        observer.unsubscribe();
        return;
      }
      validatePassword = this.validator.validate(input.password, 'password', this.validator.password);
      if (typeof(validatePassword) === 'string') {
        observer.error(validatePassword);
        observer.unsubscribe();
        return;
      }
      this.api.register(input).subscribe(
        () => {
          observer.complete();
          observer.unsubscribe();
          return;
        },
        (err) => {
          observer.error(err);
          observer.unsubscribe();
          return;
        }
      );
    });
  }
}
