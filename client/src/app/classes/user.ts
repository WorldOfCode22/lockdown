export interface IUser {
    _id: string;
    username: string;
    hash: string;
    providers: IProvider[];
}

export interface IProvider {
    _id: string;
    providerName: string;
    password: string;
}

export class User {
}
