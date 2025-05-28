import { Request, Response, NextFunction } from "express";
import { MongoDB } from "../Models/MongoDB";

export const mongoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mongoDB = MongoDB.getInstance();
    await mongoDB.connect();
    req.mongoDB = mongoDB;
    next();
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
