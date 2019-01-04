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
    id: string;
    username: string;
    hash: string;
    providers: IProvider[];

    constructor(input: IUser) {
        this.id = input._id;
        this.username = input.username;
        this.hash = input.hash;
        this.providers = input.providers;
    }
}
