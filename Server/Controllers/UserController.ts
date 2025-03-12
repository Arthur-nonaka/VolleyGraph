import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserModel } from "../Models/UserModel";

export const getUser = async (req: Request, res: Response) => {
  try {
    const collection = await req.mongoDB!.getCollection("users");
    const users = await collection.find().toArray();

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const collection = await req.mongoDB!.getCollection("users");
    const user = await collection.find({
      _id: ObjectId.createFromHexString(id),
    });

    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = new UserModel(email, password);

  try {
    const collection = await req.mongoDB!.getCollection("users");

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
    const collection = await req.mongoDB!.getCollection("users");

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

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const collection = await req.mongoDB!.getCollection("users");

      const result = await collection.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });

      if (result.deletedCount === 1) {
        res.status(200).send("User deleted successfully");
      } else {
        res.status(404).send("User not found");
      }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
