import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/users.model.ts";
import jwt from "jsonwebtoken";


export async function signup(req: Request, res: Response) {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            username: username,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created"
        });

    } catch (err) {

        console.log(err);
        res.status(500).json({
            message: "We ran into an error"
        });

    }
}


export async function login(req: Request, res: Response) {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h"
            }
        );

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: false, // switch to true in production
        //     sameSite: "strict",
        //     maxAge: 1000 * 60 * 60
        // });

        res.json({
            token,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "We ran into an error"
        });
    }
}


export async function logout(req: Request, res: Response) {
    res.clearCookie("token");

    return res.json({
        message: "Logged out successfully"
    })
}