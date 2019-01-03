import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IProvider } from '../classes/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface IAPI {
  register: (input: IUserInput) => Observable<{message: string}>;
  login: (input: IUserInput) => Observable<{message: string}>;
  deleteUser: () => Observable<{deleted: true}>;
  getUser: () => Observable<{user: IUser}>;
  editUser: (input: IEditUser) => Observable<{user: IUser}>;
  createProvider: (provider: IProviderInput) => Observable<{providers: IProvider[]}>;
  getProvider: (id: string) => Observable<{providers: IProvider[]}>;
  editProvider: (provider: IEditProvider) => Observable<{provider: IProvider}>;
  deleteProvider: (id: string) => Observable<{provider: IProvider}>;
}

export interface IUserInput {
  username: string;
  password: string;
}

export interface IEditUser {
  username?: string;
  password?: string;
}

export interface IProviderInput {
  providerName: string;
  password: string;
}

export interface IEditProvider {
  id: string;
  providerName?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService implements IAPI {

  constructor(private http: HttpClient) { }

  register(input: IUserInput) {
    return this.http.post<{message: string}>(`${environment.baseApiUrl}/api/users/`, input);
  }

  login(input: IUserInput) {
    return this.http.post<{message: string}>(`${environment.baseApiUrl}/api/users/login`, input);
  }

  deleteUser() {
    return this.http.delete<{deleted: true}>(`${environment.baseApiUrl}/api/users/login`);
  }

  getUser() {
    return this.http.get<{user: IUser}>(`${environment.baseApiUrl}/api/users/`);
  }

  editUser(input: IEditUser) {
    return this.http.put<{user: IUser}>(`${environment.baseApiUrl}/api/users/login`, input);
  }

  createProvider(input: IProviderInput) {
    return this.http.post<{providers: IProvider[]}>(`${environment.baseApiUrl}/api/providers`, input);
  }

  getProvider() {
    return this.http.get<{providers: IProvider[]}>(`${environment.baseApiUrl}/api/providers`);
  }

  deleteProvider(id: string) {
    return this.http.delete<{provider: IProvider}>(`${environment.baseApiUrl}/api/providers`, {observe: 'body', params: {id}}, );
  }

  editProvider(input: IEditProvider) {
    return this.http.put<{provider: IProvider}>(`${environment.baseApiUrl}/api/providers`, input);
  }
}
