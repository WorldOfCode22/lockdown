import { IRequest } from "../interfaces";
import { Response, NextFunction } from "express";
import { User } from "../models/user-model";

export function parseSession(req: IRequest, res: Response, next: NextFunction) {
    if (!req.session) { return next(); }
    if (!req.session.id) { return next(); }
    User.findById(req.session.id, (err, doc) => {
        req.error = err;
        if (!doc) {return next(); }
        req.user = doc;
        next();
    });
}
