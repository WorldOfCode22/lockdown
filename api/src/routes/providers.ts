import { Router } from "express";
import { IRequest } from "../interfaces";
import { AuthorizationError } from "../classes/errors/authorization-error";

const providerRouter = Router();

providerRouter.post("/", (req: IRequest, res, next) => {
    const provider = { providerName: req.body.providerName, password: req.body.password };
    if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
    req.user.addProvider(provider).subscribe(
        (providers) => {
            res.status(200).json({providers});
        },
        (err) => { req.error = err; return next(); },
        () => null,
    );
});
export { providerRouter };
