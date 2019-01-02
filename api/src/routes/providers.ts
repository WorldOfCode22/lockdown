import { Router } from "express";
import { IRequest, IProvider } from "../interfaces";
import { AuthorizationError } from "../classes/errors/authorization-error";
import { ValidationError } from "../classes/errors/validation-error";

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

providerRouter.get("/", (req: IRequest, res, next) => {
    if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
    res.status(200).json({providers: req.user.providers});
});

providerRouter.delete("/", (req: IRequest, res, next) => {
    const id = req.body.id;
    let indexToDelete = -1;
    if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
    if (!id) { req.error = new ValidationError("Id is required"); return next(); }
    const toDelete = req.user.providers.find((provider, index) => {
        if (provider._id == id) { indexToDelete = index};
        return provider._id == id;
    });
    if (!toDelete) { req.error = new ValidationError("Id is invalid"); return next(); }
    req.user.providers.splice(indexToDelete, 0);
    req.user.save((err, doc) => {
        if (err) { req.error = err}
        res.status(200).json({provider: doc.providers[indexToDelete]});
    })
});

providerRouter.put("/", (req: IRequest, res, next) => {
    const id = req.body.id;
    let providerName: string;
    let password: string;
    let newProvider: IProvider;
    let indexToUpdate = -1;
    if (!req.user) { req.error = new AuthorizationError("You are not logged in"); return next(); }
    if (!id) { req.error = new ValidationError("Id is required"); return next(); }
    const provider = req.user.providers.find((provider, index) => {
        if (provider._id == id) { indexToUpdate = index};
        return provider._id == id;
    });
    if (!provider) { req.error = new ValidationError("Id is invalid"); return next();}
    providerName = req.body.providerName || provider.providerName;
    password = req.body.password || provider.password;
    newProvider = {providerName, password};
    req.user.providers[indexToUpdate] = newProvider;
    req.user.save((err, doc) => {
        if (err) { req.error = err};
        res.status(200).json({provider: doc.providers[indexToUpdate]});
    });
});

export { providerRouter };
