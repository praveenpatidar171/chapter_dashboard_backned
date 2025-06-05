import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userAdmin = true;
    if (!userAdmin) {
        res.status(403).json({
            message: "Access Denied, admin only!!"
        })
        return;
    }

    next();
}