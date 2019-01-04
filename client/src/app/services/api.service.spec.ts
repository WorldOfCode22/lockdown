import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, IUserInput, IEditUser, IProviderInput, IEditProvider } from './api.service';
import { environment } from 'src/environments/environment';
import { IUser, IProvider } from '../classes/user';
import { HttpResponse, HttpEventType } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a message on user register', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const user: IUserInput = {username: 'test', password: 'test'};
      service.register(user).subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.message).toBe('registered');
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/users/`);
      expect(req.request.method).toEqual('POST');
      req.flush({message: 'registered'});
  }));

  it('should return a message on user login', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const user: IUserInput = {username: 'test', password: 'test'};
      service.login(user).subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.message).toBe('registered');
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/users/login`);
      expect(req.request.method).toEqual('POST');
      req.flush({message: 'registered'});
  }));

  it('should return a {deleted: true} on user delete', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      service.deleteUser().subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.deleted).toBe(true);
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/users/`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({deleted: true});
  }));

  it('should return user on getUser', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const user: IUser = {_id: '1234', username: 'test', hash: 'test', providers: []};
      service.getUser().subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.user).toBeTruthy();
          expect(data.user).toEqual(user);
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/users/`);
      expect(req.request.method).toEqual('GET');
      req.flush({user});
  }));

  it('should return user on editUser', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const user: IEditUser = {username: 'test', password: 'test'};
      const updatedUser: IUser = {username: 'test', _id: '1234', hash: 'trtrt', providers: []};
      service.editUser(user).subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.user).toBeTruthy();
          expect(data.user).toEqual(updatedUser);
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/users/`);
      expect(req.request.method).toEqual('PUT');
      req.flush({user: updatedUser});
  }));

  it('will return Provider array on provider creation', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const provider: IProviderInput = {providerName: 'test', password: 'test'};
      const newProvider: IProvider = { _id: '1234', password: 'test', providerName: 'test'};
      service.createProvider(provider).subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.providers).toBeTruthy();
          expect(data.providers).toEqual([newProvider]);
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/providers`);
      expect(req.request.method).toEqual('POST');
      req.flush({providers: [newProvider]});
  }));

  it('will return Provider array on provider get request', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const provider: IProvider = { _id: '1234', password: 'test', providerName: 'test'};
      service.getProvider().subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.providers).toBeTruthy();
          expect(data.providers).toEqual([provider]);
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/providers`);
      expect(req.request.method).toEqual('GET');
      req.flush({providers: [provider]});
  }));

  it('will return deleted provider for provider delete request', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const provider: IProvider = { _id: '1234', password: 'test', providerName: 'test'};
      service.deleteProvider('1234').subscribe(
        (data) => {
          if (data.type === HttpEventType.Response) {
            expect(data.body.provider).toEqual(provider);
          }
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/providers`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({provider});
  }));

  it('will return edited provider for provider edit request', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const providerInput: IEditProvider = {id: '1234', providerName: 'test', password: 'test'};
      const provider: IProvider = {_id: '1234', providerName: 'test', password: 'test'};
      service.editProvider(providerInput).subscribe(
        (data) => {
          expect(data).toBeTruthy();
          expect(data.provider).toBeTruthy();
          expect(data.provider).toEqual(provider);
        },
        (err) => {throw err; },
        () => {}
      );
      const req = httpMock.expectOne(`${environment.baseApiUrl}/api/providers`);
      expect(req.request.method).toEqual('PUT');
      req.flush({provider});
  }));

});
