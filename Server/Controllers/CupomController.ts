import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserModel } from "../Models/UserModel";
import { ResponseMessages } from "../Constants/ResponseMessages";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CupomModel } from "../Models/CupomModel";

export const getCupom = async (req: Request, res: Response) => {
  try {
    const collection = await req.mongoDB!.getCollection("cupoms");
    const cupoms = await collection.find().toArray();

    res.status(200).json(cupoms);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getCupomById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const collection = await req.mongoDB!.getCollection("cupoms");
    const cupom = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (cupom) {
      res.status(201).json(cupom);
    } else {
      res.status(404).send(ResponseMessages.USER_NOT_FOUND);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createCupom = async (req: Request, res: Response) => {
  const { name, discount, expirationDate } = req.body;
  const cupom = new CupomModel(name, discount, expirationDate);

  const errors = await validate(cupom);
  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("cupoms");

    const existingCupom = await collection.findOne({ name: cupom.getName() });
    if (existingCupom) {
      res.status(400).send(ResponseMessages.USER_ALREADY_EXISTS);
      return;
    }

    const result = await collection.insertOne(cupom);
    if (result) {
      res.status(201).json({
        userId: result.insertedId,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_CREATING_USER);
    }
  } catch (error: any) {
    res.status(500).send("Database error");
  }
};

export const updateCupom = async (req: Request, res: Response) => {
  const { name, discount, expirationDate } = req.body;
  const { id } = req.params;

  try {
    const collection = await req.mongoDB!.getCollection("cupoms");

    const result = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      res.status(404).send(ResponseMessages.USER_NOT_FOUND);
      return;
    }

    const cupom = new CupomModel(
      result!.name,
      result!.discount,
      result!.expirationDate
    );

    if (name) {
      cupom.setName(name);
    }
    if (discount) {
      cupom.setDiscount(discount);
    }
    if (expirationDate) {
      cupom.setExpirationDate(expirationDate);
    }

    const errors = await validate(cupom);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const existingCupom = await collection.findOne({ name: cupom.getName() });
    if (existingCupom) {
      res.status(400).send(ResponseMessages.USER_ALREADY_EXISTS);
      return;
    }

    if (
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: cupom })
    ) {
      res.status(201).send(ResponseMessages.USER_UPDATED_SUCCESSFULLY);
    } else {
      res.status(500).send(ResponseMessages.ERROR_UPDATING_USER);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteCupom = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const collection = await req.mongoDB!.getCollection("cupoms");

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
