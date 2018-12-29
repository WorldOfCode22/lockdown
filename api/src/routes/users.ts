import { Router } from "express";
import { Validator } from "../classes/validator";
import { ValidationError } from "../classes/errors/validation-error";
import { IRequest } from "../interfaces";
import { User } from "../models/user-model";

const userRouter = Router();

userRouter.post("/", (req: IRequest, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    Validator.validateUsername(username, true).subscribe(
        () => null,
        (err) => { req.error = err; return next(); },
        () => {
            Validator.validatePassword(password).subscribe(
                () => null,
                (err) => { req.error = err; return next(); },
                () => {
                    User.hashAndSave({username, password}).subscribe(
                        () => null,
                        (err) => { req.error = err; return next(); },
                        () => { res.status(200).json({message: "registered"}); },
                    );
                },
            );
        },
    );
});

userRouter.post("/login", (req: IRequest, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    Validator.validateUsername(username, false).subscribe(
        () => null,
        (err) => { req.error = err; return next(); },
        () => {
            Validator.validatePassword(password).subscribe(
                () => null,
                (err) => { req.error = err; return next(); },
                () => {
                    User.getUserAndCompare({username, password}).subscribe(
                        (user) => {
                            if (req.session) { req.session.id = user.id; }
                            res.status(200).json({message: "logged in"});
                        },
                        (err) => { req.error = err; return next(); },
                        () => null,
                    );
                },
            );
        },
    );
});

export { userRouter };
