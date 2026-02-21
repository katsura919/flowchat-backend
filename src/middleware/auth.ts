import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createError } from "./errorHandler";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError("No token provided. Access denied.", 401));
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return next(createError("JWT secret is not configured", 500));
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(createError("Invalid or expired token", 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createError("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        createError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};
