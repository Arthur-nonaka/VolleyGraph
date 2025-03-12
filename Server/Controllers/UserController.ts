import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserModel } from "../Models/UserModel";
import { MongoDB } from "../Models/MongoDB";

export const getUser = async (req: Request, res: Response) => {
  try {
    const mongoDB = new MongoDB();
    await mongoDB.connect();

    const collection = await mongoDB.getCollection("users");
    const users = await collection.find().toArray();

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = new UserModel(email, password);

  try {
    const mongoDB = new MongoDB();
    await mongoDB.connect();

    const collection = await mongoDB.getCollection("users");

    if (await collection.insertOne(user)) {
      res.status(201).send("User created successfully");
    } else {
      res.status(500).send("Error creating user");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { email, password, id } = req.body;

  try {
    const mongoDB = new MongoDB();
    await mongoDB.connect();

    const collection = await mongoDB.getCollection("users");

    const result = await collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (!result) {
      res.status(404).send("User not found");
    }

    const user = new UserModel(result!.email, result!.password);

    if (email) {
      user!.setEmail(email);
    }
    if (password) {
      user!.setPassword(password);
    }

    if (
      await collection.updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: user }
      )
    ) {
      res.status(201).send("User updated successfully");
    } else {
      res.status(500).send("Error updating user");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteUser = (req: Request, res: Response) => {
  res.status(200).send("Delete User");
};
