import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { getUser, createUser, updateUser, deleteUser } from "./UserController";

dotenv.config();
const app = express();

const PORT = 3000;

app.get("/user", getUser);
app.post("/user", createUser);
app.put("/user", updateUser);
app.delete("/user", deleteUser);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
    console.log("http://127.0.0.1:3000");
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
