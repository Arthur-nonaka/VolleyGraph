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
  getHighestPriceItem,
} from "./ItemController";
import {
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
} from "./TeamController";
import {
  getCupom,
  createCupom,
  updateCupom,
  deleteCupom,
  getCupomById,
  validateCupom,
} from "./CupomController";
import {
  addPlayerToTeam,
  removePlayerFromTeam,
  getTeamsForPlayer,
  getPlayersForTeam,
} from "./PlayerTeamController";
import {
  getCart,
  getAllCarts,
  createCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  deleteCart,
  getCartSummary,
} from "./CartController";
import {
  getSale,
  getSaleById,
  getSalesByUser,
  createSale,
  createSaleFromCart,
  updateSaleStatus,
  cancelSale,
  updateSaleNotes,
  getSalesStatistics,
  deleteSale,
} from "./SaleController";
import {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  deleteMatch,
} from "./MatchController";
import { MongoDB } from "../Models/MongoDB";
import path from "path";
import { get } from "http";
import { RequestHandler } from "express";

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
const corsMiddleware: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(204); // ou res.status(204).end();
    return; // importante para não quebrar o type
  }

  next();
};

app.use(corsMiddleware);

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
app.post("/item/highest", getHighestPriceItem);
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
app.post("/remove-player", removePlayerFromTeam);
app.post("/add-player", addPlayerToTeam);

app.get("/cupom", getCupom);
app.get("/cupom/:id", getCupomById);
app.post("/cupom", createCupom);
app.post("/cupom/validate", validateCupom);
app.put("/cupom/:id", updateCupom);
app.delete("/cupom/:id", deleteCupom);

app.get("/cart/all", getAllCarts);
app.get("/cart/:userId", getCart);
app.get("/cart/:userId/summary", getCartSummary);
app.post("/cart", createCart);
app.post("/cart/:userId/item", addItemToCart);
app.put("/cart/:userId/item", updateItemQuantity);
app.delete("/cart/:userId/item", removeItemFromCart);
app.delete("/cart/:userId/clear", clearCart);
app.delete("/cart/:userId", deleteCart);

// Sale routes
app.get("/sale", getSale);
app.get("/sale/statistics", getSalesStatistics);
app.get("/sale/:id", getSaleById);
app.get("/sale/user/:userId", getSalesByUser);
app.post("/sale", createSale);
app.post("/sale/from-cart", createSaleFromCart);
app.put("/sale/:id/status", updateSaleStatus);
app.put("/sale/:id/notes", updateSaleNotes);
app.put("/sale/:id/cancel", cancelSale);
app.delete("/sale/:id", deleteSale);

app.get("/match", getMatches);
app.get("/match/:id", getMatchById);
app.post("/match", createMatch);
app.put("/match/:id", updateMatch);
app.delete("/match/:id", deleteMatch);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
    console.log("http://127.0.0.1:3000");
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
