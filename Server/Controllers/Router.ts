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
  uploadImage,
} from "./PlayerController";
import {
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemById,
} from "./ItemController";
import {
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
} from "./TeamController";
import {
  addPlayerToTeam,
  removePlayerFromTeam,
  getTeamsForPlayer,
  getPlayersForTeam,
} from "./PlayerTeamController";
import { MongoDB } from "../Models/MongoDB";
import path from "path";

declare global {
  namespace Express {
    interface Request {
      mongoDB?: MongoDB;
    }
  }
}

dotenv.config();
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = 3000;

app.use(mongoMiddleware);
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.get("/user", getUser);
app.get("/user/:id", getUserById);
app.post("/user", createUser);
app.post("/user/login", loginUser);
app.put("/user/:id", updateUser);
app.delete("/user/:id", deleteUser);

app.get("/player", getPlayer);
app.get("/player/:id", getPlayerById);
app.post("/player", uploadImage, createPlayer);
app.put("/player/:id", uploadImage, updatePlayer);
app.delete("/player/:id", deletePlayer);

app.get("/item", getItem);
app.get("/item/:id", getItemById);
app.post("/item", uploadImage, createItem);
app.put("/item/:id", uploadImage, updateItem);
app.delete("/item/:id", deleteItem);

app.get("/team", getTeam);
app.get("/team/:id", getTeamById);
app.post("/team", uploadImage, createTeam);
app.put("/team/:id", uploadImage, updateTeam);
app.delete("/team/:id", deleteTeam);

app.get("/team/player/:playerId", getTeamsForPlayer);
app.get("/player/team/:teamId", getPlayersForTeam);
app.post("/team/player", addPlayerToTeam);
app.delete("/team/player", removePlayerFromTeam);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
    console.log("http://127.0.0.1:3000");
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
