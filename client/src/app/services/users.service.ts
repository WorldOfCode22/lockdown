import { Injectable } from '@angular/core';
import { ApiService, IUserInput } from './api.service';
import { User } from '../classes/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user: User | null;
  loggedIn = false;

  constructor(public api: ApiService) { }

  register(input: IUserInput) {
    return new Observable<void>((observer) => {
      if (this.loggedIn) {
        observer.complete();
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
