import { type NextFunction, type Request, type Response } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`A ${req.method} request received on ${req.originalUrl}`);
    next();
}
