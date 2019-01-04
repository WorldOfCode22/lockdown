import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { ApiService, IUserInput } from './api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ApiService]
  }));

  beforeEach(() => {
    service = TestBed.get(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should synchronously complete observable if user is logged in', () => {
    service.loggedIn = true;
    const input: IUserInput = {username: 'test', password: 'test'};
    service.register(input).subscribe(
      () => null,
      (err) => { fail(err); },
      () => { expect(true).toBe(true); }
    );
  });
});
