import { MongoDB } from "../Models/MongoDB";

declare global {
  namespace Express {
    interface Request {
      mongoDB?: MongoDB;
    }
  }
}

export {};
