import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserModel } from "../Models/UserModel";
import { ResponseMessages } from "../Constants/ResponseMessages";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  const { id } = req.params;
  try {
    const collection = await req.mongoDB!.getCollection("users");
    const user = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).send(ResponseMessages.USER_NOT_FOUND);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, address, isAdmin } = req.body;
  const user = new UserModel(email, password, address);
  if (typeof isAdmin !== 'undefined') {
    user.setIsAdmin(isAdmin === true || isAdmin === 'true');
  }

  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("users");

    const existingUser = await collection.findOne({ email: user.getEmail() });
    if (existingUser) {
      res.status(400).send(ResponseMessages.USER_ALREADY_EXISTS);
      return;
    }

    const hashedPassword = await bcrypt.hash(user.getPassword(), 10);
    user.setPassword(hashedPassword);

    const result = await collection.insertOne(user);
    if (result) {
      res.status(201).json({
        message: ResponseMessages.USER_CREATED_SUCCESSFULLY,
        userId: result.insertedId,
        isAdmin: user.getIsAdmin(),
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_CREATING_USER);
    }
  } catch (error: any) {
    res.status(500).send("Database error");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { id } = req.params;

  try {
    const collection = await req.mongoDB!.getCollection("users");

    const result = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      res.status(404).send(ResponseMessages.USER_NOT_FOUND);
      return;
    }

    const user = new UserModel(
      result!.email,
      result!.password,
      result!.address
    );

    if (email) {
      user!.setEmail(email);
    }
    if (password) {
      user!.setPassword(password);
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const hashedPassword = await bcrypt.hash(user.getPassword(), 10);
    user.setPassword(hashedPassword);

    const existingUser = await collection.findOne({ email: user.getEmail() });
    if (existingUser) {
      res.status(400).send(ResponseMessages.USER_ALREADY_EXISTS);
      return;
    }

    if (await collection.updateOne({ _id: new ObjectId(id) }, { $set: user })) {
      res.status(201).send(ResponseMessages.USER_UPDATED_SUCCESSFULLY);
    } else {
      res.status(500).send(ResponseMessages.ERROR_UPDATING_USER);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const collection = await req.mongoDB!.getCollection("users");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      res.status(200).send(ResponseMessages.USER_DELETED_SUCCESSFULLY);
    } else {
      res.status(404).send(ResponseMessages.ERROR_DELETING_USER);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email);
  try {
    const collection = await req.mongoDB!.getCollection("users");
    const user = await collection.findOne({ email });

    if (!user) {
      res.status(400).send(ResponseMessages.USER_NOT_FOUND);
      return;
    }

    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) {
      res.status(400).send(ResponseMessages.INVALID_PASSWORD);
      return;
    }

    // const payload = { userId: user._id, email: user.email }; // Payload pode conter qualquer informação que você queira no token
    // const secret = process.env.JWT_SECRET || "ED934C16AA59B35D8D55114F7A6D3"; // Substitua 'yourSecretKey' com uma chave secreta real
    // const token = jwt.sign(payload, secret, { expiresIn: "1w" });

    res.status(200).json({
      message: ResponseMessages.LOGIN_SUCCESS,
      userId: user._id,
      isAdmin: user.isAdmin,
      // token: token, // Retornando o token
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send(ResponseMessages.LOGIN_FAILED);
  }
};
