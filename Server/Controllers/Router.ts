import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { mongoMiddleware } from "./MongoMiddleware";
import {
  getUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
} from "./UserController";
import {
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerById,
} from "./PlayerController";
import { MongoDB } from "../Models/MongoDB";

declare global {
  namespace Express {
    interface Request {
      mongoDB?: MongoDB;
    }
  }
}

dotenv.config();
const app = express();

const PORT = 3000;

app.use(mongoMiddleware);
app.use(bodyParser.json());
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.get("/user", getUser);
app.get("/user/:id", getUserById);
app.post("/user", createUser);
app.post("/user/login", loginUser);
app.put("/user/:id", updateUser);
app.delete("/user/:id", deleteUser);

app.get("/player", getPlayer);
app.get("/player/:id", getPlayerById);
app.post("/player", createPlayer);
app.put("/player/:id", updatePlayer);
app.delete("/player/:id", deletePlayer);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
    console.log("http://127.0.0.1:3000");
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
