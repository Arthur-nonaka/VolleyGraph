import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PlayerModel } from "../Models/PlayerModel";
import { validate } from "class-validator";

export const getPlayer = async (req: Request, res: Response) => {
  try {
    const collection = await req.mongoDB!.getCollection("players");
    const players = await collection.find().toArray();

    res.status(200).json(players);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getPlayerById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const collection = await req.mongoDB!.getCollection("players");
    const player = await collection.find({
      _id: ObjectId.createFromHexString(id),
    });

    if (player) {
      res.status(201).json(player);
    } else {
      res.status(404).send("Player Not Found");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createPlayer = async (req: Request, res: Response) => {
  const { name, age, height, mainPosition, subPosition } = req.body;
  const player = new PlayerModel(
    name,
    age,
    height,
    mainPosition,
    subPosition,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    false
  );

  const errors = await validate(player);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

  try {
    const collection = await req.mongoDB!.getCollection("players");

    if (await collection.insertOne(player)) {
      res.status(201).send("Player created successfully");
    } else {
      res.status(500).send("Error creating player");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updatePlayer = async (req: Request, res: Response) => {
  const {
    name,
    age,
    height,
    mainPosition,
    subPosition,
    APass,
    BPass,
    CPass,
    ASet,
    BSet,
    CSet,
    points,
    blockPoints,
    servePoints,
    spikePoints,
    retired,
    id,
  } = req.body;

  try {
    const collection = await req.mongoDB!.getCollection("players");

    const result = await collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (!result) {
      res.status(404).send("Player not found");
    }

    const player = new PlayerModel(
      result!.name,
      result!.age,
      result!.height,
      result!.mainPosition,
      result!.subPosition,
      result!.APass,
      result!.BPass,
      result!.CPass,
      result!.ASet,
      result!.BSet,
      result!.CSet,
      result!.points,
      result!.blockPoints,
      result!.ServePoints,
      result!.spikePoints,
      result!.retired
    );

    if (name) {
      player.setName(name);
    }
    if (age) {
      player.setAge(age);
    }
    if (height) {
      player.setHeight(height);
    }
    if (mainPosition) {
      player.setMainPosition(mainPosition);
    }
    if (subPosition) {
        player.setSubPosition(subPosition);
      }
    if (APass) {
      player.setAPass(APass);
    }
    if (BPass) {
      player.setBPass(BPass);
    }
    if (CPass) {
      player.setCPass(CPass);
    }
    if (ASet) {
      player.setASet(ASet);
    }
    if (BSet) {
      player.setBSet(BSet);
    }
    if (CSet) {
      player.setCSet(CSet);
    }
    if (points) {
      player.setPoints(points);
    }
    if (blockPoints) {
      player.setBlockPoints(blockPoints);
    }
    if (servePoints) {
      player.setServePoints(servePoints);
    }
    if (spikePoints) {
      player.setSpikePoints(spikePoints);
    }
    if (retired !== undefined) {
      player.setRetired(retired);
    }

    if (
      await collection.updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: player }
      )
    ) {
      res.status(201).send("Player updated successfully");
    } else {
      res.status(500).send("Error updating player");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deletePlayer = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const collection = await req.mongoDB!.getCollection("players");

    const result = await collection.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (result.deletedCount === 1) {
      res.status(200).send("Player deleted successfully");
    } else {
      res.status(404).send("Error deleting player");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};