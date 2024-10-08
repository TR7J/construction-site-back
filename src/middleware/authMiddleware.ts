import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer xxxxx
    const decode = jwt.verify(token, process.env.TOKENSECRET as string);
    req.user = decode as {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      tenantId: string;
      token: string;
    };
    next();
  } else {
    res.status(401).json({ message: "No Token" });
  }
};
