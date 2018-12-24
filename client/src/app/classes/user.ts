export interface IUser {
  id: string;
  username: string;
}

export class User {
  constructor(public _User: IUser) {}

  get Username() {return this._User.username; }
  get Id() {return this._User.id; }
}
