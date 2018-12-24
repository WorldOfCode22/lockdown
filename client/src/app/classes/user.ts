export interface IPasswordProvider {
  applicationName: string;
  password: string;
}

export interface IUser {
  id: string;
  username: string;
  passwordProviders: IPasswordProvider[];
}

export class User {
  constructor(public _User: IUser) {}

  get Username() {return this._User.username; }
  get Id() {return this._User.id; }
  get Providers() {return this._User.passwordProviders; }
  AddProvider(provider: IPasswordProvider) {
    this._User.passwordProviders.push(provider);
  }
}
