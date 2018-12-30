import { Schema, model } from "mongoose";
import { IUserModel, IUserDoc, IValidator, ICandidateUser, IUser, IProvider } from "../interfaces";
import { Observable } from "rxjs";
import { hash, compare } from "bcryptjs";
import { ValidationError } from "../classes/errors/validation-error";
import { Validator } from "../classes/validator";

export const usernameValidator: IValidator = {
    min: 8,
    max: 20,
};

export const passwordValidator: IValidator = {
    min: 8,
    max: 18,
    capLetters: 1,
    specialChars: 1,
};

export const providerNameValidator: IValidator = {
    min: 1,
    max: 30,
};

export const providerPasswordValidator: IValidator = {
    min: 1,
    max: 30,
};

const ProviderSchema = new Schema({
    providerName: {
        type: String,
        minlength: providerNameValidator.min,
        maxlength: providerNameValidator.max,
    },
    password: {
        type: String,
        minlength: providerPasswordValidator.min,
        maxlength: providerPasswordValidator.max,
    },
});

const UserSchema = new Schema({
    username: {
        type: String,
        minlength: usernameValidator.min,
        maxlength: usernameValidator.max,
        unique: true,
    },
    hash: {
        type: String,
        minlength: 60,
        maxlength: 60,
    },
    providers: [{type: ProviderSchema}],
});

UserSchema.statics.hashAndSave = function(user: ICandidateUser) {
    const self: IUserModel = this;
    const userToSave: IUser = { username: user.username, hash: "", providers: [] };
    return new Observable((observer) => {
        hash(user.password, 10, (err, passHash) => {
            if (err) { observer.error(err); observer.unsubscribe(); return; }
            if (passHash) {
                userToSave.hash = passHash;
                self.create(userToSave, (saveErr: Error) => {
                    if (saveErr) { observer.error(saveErr); observer.unsubscribe(); return; }
                    observer.complete();
                    observer.unsubscribe();
                });
            }
        });
    });
};

UserSchema.statics.getUserAndCompare = function(user: ICandidateUser) {
    const self: IUserModel = this;
    return new Observable<IUserDoc>((observer) => {
        self.findOne({username: user.username}, (err, doc) => {
            if (err) { observer.error(err); observer.unsubscribe(); return; }
            if (!doc) { observer.error( new ValidationError("Invalid login")); observer.unsubscribe(); return; }
            compare(user.password, doc.hash, (compareErr, done) => {
                if (compareErr) { observer.error(compareErr); observer.unsubscribe(); return; }
                if (!done) { observer.error( new ValidationError("Invalid login")); observer.unsubscribe(); return; }
                observer.next(doc);
                observer.unsubscribe();
            });
        });
    });
};

UserSchema.methods.addProvider = function(provider: IProvider) {
    const self: IUserDoc = this;
    const providerNameSpec = Validator.providerName;
    const passwordSpec = Validator.providerPassword;
    return new Observable<IProvider[]>((observer) => {
        if (provider.providerName.length >= providerNameSpec.min &&
            provider.providerName.length <= providerNameSpec.max ) {
                if (provider.password.length >= passwordSpec.min && provider.password.length <= passwordSpec.max) {
                    self.providers.push(provider);
                    self.save((err, doc) => {
                        if (err) { observer.error(err); observer.unsubscribe(); return; }
                        observer.next(doc.providers);
                        observer.complete();
                        observer.unsubscribe();
                    });
                } else {
                    observer.error(
                        new ValidationError(
                            `password must have a length between ${passwordSpec.min} and ${passwordSpec.max}`,
                        ),
                    );
                    observer.unsubscribe();
                }
        } else {
            observer.error(
                new ValidationError(
                    `provider name must have a length between ${providerNameSpec.min} and ${providerNameSpec.max}`,
                ),
            );
            observer.unsubscribe();
        }
    });
};

export const User = model<IUserDoc, IUserModel>("user", UserSchema);
