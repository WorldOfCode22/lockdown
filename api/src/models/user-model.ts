import { Schema, model } from "mongoose";
import { IUserModel, IUserDoc, IValidator, ICandidateUser, IUser } from "../interfaces";
import { Observable } from "rxjs";
import { hash, compare } from "bcryptjs";
import { ValidationError } from "../classes/errors/validation-error";

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
});

UserSchema.statics.hashAndSave = function(user: ICandidateUser) {
    const self: IUserModel = this;
    const userToSave: IUser = { username: user.username, hash: "" };
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
    const userToSave: IUser = { username: user.username, hash: "" };
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

export const User = model<IUserDoc, IUserModel>("user", UserSchema);
