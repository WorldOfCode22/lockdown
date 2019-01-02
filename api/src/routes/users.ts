import { Router } from "express";
import { Validator } from "../classes/validator";
import { IRequest } from "../interfaces";
import { User } from "../models/user-model";
import { AuthorizationError } from "../classes/errors/authorization-error";
import { hash } from "bcryptjs";

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

userRouter.get("/", (req: IRequest, res, next) => {
    if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
    res.status(200).json({user: req.user});
});

userRouter.delete("/", (req: IRequest, res, next) => {
    if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
    req.user.remove((err) => {
        if (err) { req.error = err}
        res.status(200).json({deleted: true});
    })
});

userRouter.put("/", (req: IRequest, res, next) => {
    const save = () => {
        if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
        req.user.save((err, doc) => {
            if (err) { req.error = err; return next(); }
            res.status(200).json({user: doc});
            return next();
        });
    }

    let username: string;
    let password: string | null;
    if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
    username = req.body.username || req.user.username;
    password = req.body.password || null;
    Validator.validateUsername(username, true).subscribe(
        () => null,
        (err) => { req.error = err; return next(); },
        () => {
            if (!req.user) {return;}
            req.user.username = username;
            if (!password) { return save();}
            Validator.validatePassword(password).subscribe(
                () => null,
                (err) => { req.error = err; return next(); },
                () => {
                    // to make ts happy
                    if (!password) {return;}
                    hash(password, 10, (err, _hash) => {
                        if (err) { req.error = err; return next(); }
                        if (!req.user) {return;}
                        req.user.hash = _hash;
                        return save();
                    });
                }
            );
        }
    );
});

export { userRouter };
