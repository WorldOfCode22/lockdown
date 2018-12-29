import { Router } from "express";
import { Validator } from "../classes/validator";
import { ValidationError } from "../classes/errors/validation-error";
import { IRequest } from "../interfaces";
import { User } from "../models/user-model";

const userRouter = Router();

userRouter.post("/", (req: IRequest, res, next) => {
    console.log("Hello");
    const username = req.body.username;
    const password = req.body.password;
    Validator.validateUsername(username).subscribe(
        () => null,
        (err) => { req.error = err; console.log(err); return next(); },
        () => {
            Validator.validatePassword(password).subscribe(
                () => null,
                (err) => { req.error = err; console.log(err); return next(); },
                () => {
                    User.hashAndSave({username, password}).subscribe(
                        () => null,
                        (err) => { req.error = err; console.log(err); return next(); },
                        () => { res.status(200).json({message: "registered"}); },
                    );
                },
            );
        },
    );
});

export { userRouter };
