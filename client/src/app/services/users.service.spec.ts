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
    const input: IUserInput = {username: 'testtest', password: 'testtest'};
    service.register(input).subscribe(
      () => null,
      (err) => { fail(err); },
      () => { expect(true).toBe(true); }
    );
  });

  it('Should synchronously error in observable if username is to short on register', () => {
    const input: IUserInput = {username: 't'.repeat(service.validator.username.min - 1), password: 'testte!T'};
    service.register(input).subscribe(
      () => { fail(); },
      (err) => { expect(err).toBeTruthy(); },
      () => null
    );
  });

  it('Should synchronously error in observable if username is to long on register', () => {
    const input: IUserInput = {username: 't'.repeat(service.validator.username.max + 1), password: 'testte!T'};
    service.register(input).subscribe(
      () => { fail(); },
      (err) => { expect(err).toBeTruthy(); },
      () => null
    );
  });

  it('Should synchronously error in observable if password is to short on register', () => {
    const input: IUserInput = {username: 't'.repeat(service.validator.username.max),
      password: 'T'.repeat(service.validator.password.min - 2) + '!'};
    service.register(input).subscribe(
      () => { fail(); },
      (err) => { expect(err).toBeTruthy(); },
      () => null
    );
  });

  it('Should synchronously error in observable if password is to long on register', () => {
    const input: IUserInput = {username: 't'.repeat(service.validator.username.max),
      password: 'T'.repeat(service.validator.password.max) + '!'};
    service.register(input).subscribe(
      () => { fail(); },
      (err) => { expect(err).toBeTruthy(); },
      () => null
    );
  });

  it('Should synchronously error in observable if password is short on special chars in register', () => {
    const input: IUserInput = {username: 't'.repeat(service.validator.username.max),
      password: 'T'.repeat(service.validator.password.max)};
    service.register(input).subscribe(
      () => { fail(); },
      (err) => { expect(err).toBeTruthy(); },
      () => null
    );
  });

  it('Should synchronously error in observable if password is short on capital letters in register', () => {
    const input: IUserInput = {username: 't'.repeat(service.validator.username.max),
      password: 'T'.repeat(service.validator.password.max)};
    service.register(input).subscribe(
      () => { fail(); },
      (err) => { expect(err).toBeTruthy(); },
      () => null
    );
  });
});
