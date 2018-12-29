import { IRequest } from "../interfaces";
import { Response, NextFunction } from "express";
import { ValidationError } from "../classes/errors/validation-error";

export function errorHandler(req: IRequest, res: Response, next: NextFunction) {
    if (!req.error) { return next(); }
    if (req.error instanceof ValidationError) {
        res.status(400).json({ValidationError: req.error.message});
    }
}
