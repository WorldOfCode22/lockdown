import {Document, Model} from "mongoose";
import { Request } from "express";
import { Observable } from "rxjs";

export interface IConfig {
    port: string;
    mongoUri: string;
}

export interface IValidator {
    min: number;
    max: number;
    capLetters?: number;
    specialChars?: number;
}

export interface IRequest extends Request {
    error?: Error;
    session?: any;
    user?: IUserDoc;
}

export interface ICandidateUser {
    username: string;
    password: string;
}

export interface IUser {
    username: string;
    hash: string;
    providers: IProvider[];
}

export interface IProvider {
    providerName: string;
    password: string;
    _id?: string;
}

export interface IUserDoc extends Document, IUser {
    addProvider: (provider: IProvider) => Observable<IProvider[]>;
}

export interface IUserModel extends Model<IUserDoc> {
    hashAndSave: (user: ICandidateUser) => Observable<void>;
    getUserAndCompare: (user: ICandidateUser) => Observable<IUserDoc>;
}

export type ErrorOnlyCallback = (error?: Error) => any;
