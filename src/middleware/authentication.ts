import type {Request, Response, NextFunction } from "express";

export function authentication(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"];

    if (req.method !== "GET" && apiKey !== "12345678") {
        return res.status(401).json({ message: "x-api-key header is invalid!" });
    }

    return next();
}
