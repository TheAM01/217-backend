import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    username: string;
}

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token as string | undefined;

    if (!token) {
        return res.status(401).json({
            message: "Please log in to access this page"
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        req.user = payload;

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}


// protocol + domain + port
// http://localhost:3000 (next.js)
// http://localhost:8000 (express)