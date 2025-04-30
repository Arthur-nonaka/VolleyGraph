import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PlayerModel } from "../Models/PlayerModel";
import { validate } from "class-validator";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
});

export const uploadImage = upload.single("image");

export const getPlayer = async (req: Request, res: Response) => {
  try {
    const { name, mainPositions } = req.query;
    const collection = await req.mongoDB!.getCollection("players");

    const filters: any = {};
    if (name) {
      filters.name = { $regex: new RegExp(name as string, "i") };
    }
    if (mainPositions) {
      const positions = Array.isArray(mainPositions)
        ? mainPositions
        : [mainPositions];
      filters.mainPosition = { $in: positions };
    }

    const players = await collection.find(filters).toArray();

    players.forEach((player) => {
      player.age = new Date(player.age).toISOString().split("T")[0];
    });

    res.status(200).json(players);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getPlayerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const collection = await req.mongoDB!.getCollection("players");

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid ID format" });
    }

    const player = await collection.findOne({
      _id: new ObjectId(id),
    });

    player!.age = new Date(player!.age).toISOString().split("T")[0];

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
  const imageUrl = req.file
    ? `https://solid-tribble-g6xr9gvpj76hr5g-3000.app.github.dev/uploads/${req.file.filename}`
    : null;

  const player = new PlayerModel(
    name,
    new Date(age),
    parseFloat(height),
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
    false,
    imageUrl
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
  } = req.body;

  const imageUrl = req.file
    ? `https://solid-tribble-g6xr9gvpj76hr5g-3000.app.github.dev/uploads/${req.file.filename}`
    : null;

  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const collection = await req.mongoDB!.getCollection("players");

    const result = await collection.findOne({
      _id: new ObjectId(id),
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
      result!.retired,
      result!.imageUrl
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
    if (imageUrl) {
      player.setImageUrl(imageUrl);
    }

    if (
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: player })
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
  const { id } = req.params;

  try {
    const collection = await req.mongoDB!.getCollection("players");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
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
