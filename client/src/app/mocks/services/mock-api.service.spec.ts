import { TestBed } from '@angular/core/testing';

import { MockApiService } from './mock-api.service';

describe('MockApiService', () => {
  let service: MockApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(MockApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('Should return an error during login if ValidNextRequest = false', (done) => {
    service.ValidNextRequest = false;
    service.TimeToExe = 100;
    service.Login().subscribe({
      next() {fail('got true expected an error'); done(); },
      error(err) {expect(err).toBeTruthy(); done(); }
    });
  });

  xit('Should return true during login if ValidNextRequest = true', () => {
    service.ValidNextRequest = true;
    service.TimeToExe = 100;
    service.Login().subscribe({
      next(data) {expect(data).toBeTruthy(); },
      error(err) {fail(err); }
    });
  });
});
