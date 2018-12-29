import { Observable } from "rxjs";
import { User, usernameValidator, passwordValidator } from "../models/user-model";
import { ValidationError } from "./errors/validation-error";

export abstract class Validator {
    public static username = usernameValidator;

    public static password = passwordValidator;

    public static validateUsername(username: string, checkTaken: boolean) {
        const usernameSpec = Validator.username;
        return new Observable((observer) => {
            /// makes sure username length is valid
            if (username.length >= usernameSpec.min && username.length <= usernameSpec.max ) {
                if (!checkTaken) { observer.complete(); observer.unsubscribe(); return; }
                /// see if username is not already taken
                User.findOne({username}, (err, doc) => {
                    /// catch mongo error
                    if (err) {
                        observer.error(err);
                        observer.unsubscribe();
                        /// username taken
                    } else if (doc) {
                        observer.error(
                            new ValidationError("username taken"),
                        );
                        observer.unsubscribe();
                        /// username valid
                    } else {
                        observer.complete();
                        observer.unsubscribe();
                    }
                });
            } else {
                /// error if length is invalid
                observer.error(
                    new ValidationError(
                        `username must have a length between ${usernameSpec.min} and ${usernameSpec.max}`),
                );
            }
        });
    }

    public static validatePassword(password: string ) {
        const passSpec = Validator.password;
        return new Observable((observer) => {
            if (password.length >= passSpec.min && password.length <= passSpec.max) {
                /// check for minimum number of uppercase chars
                if (Validator.isEnoughUpperCase(password, passSpec.capLetters || 0)) {
                    /// check for minimum number of special chars
                    if (Validator.isEnoughSpecialChars(password, passSpec.specialChars || 0)) {
                        observer.complete();
                        observer.unsubscribe();
                    } else {
                        observer.error(
                            new ValidationError(`password must have at least ${passSpec.specialChars} special chars`),
                        );
                        observer.unsubscribe();
                    }
                } else {
                    observer.error(new ValidationError(`password must have ${passSpec.capLetters} capital letters`));
                    observer.unsubscribe();
                }
            } else {
                observer.error(
                    new ValidationError(`Password must have a length between ${passSpec.min} and ${passSpec.max} `),
                );
                observer.unsubscribe();
            }
        });
    }

    // method to see if enough upper case chars are present to pass validation
    public static isEnoughUpperCase(str: string, minUpperCaseChars: number) {
        const specialChars = "!@#$%^&*()_-+={[]}:;.>,</`~";
        let actualUpperCaseChars = 0;
        let valid = false;
        /// loop through chars in  string
        for (const char of str) {
            /// check char is uppercase and not a special char
            if (char.toUpperCase() === char && specialChars.indexOf(char) === -1) { actualUpperCaseChars++; }
            if (actualUpperCaseChars >= minUpperCaseChars) { valid = true; break; }
        }
        return valid;
    }

    // method to see if enough special chars are present to pass validation
    public static isEnoughSpecialChars(str: string, minSpecialChars: number) {
        const specialChars = "!@#$%^&*()_-+={[]}:;.>,</`~";
        let actualSpecialChars = 0;
        let valid = false;
        /// loop through chars of injected string
        for (const char of str) {
            if (specialChars.indexOf(char) > -1) { actualSpecialChars++; }
            if (actualSpecialChars >= minSpecialChars) { valid = true; break; }
        }
        return valid;
    }
}
