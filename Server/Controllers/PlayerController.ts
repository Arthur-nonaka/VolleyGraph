import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { PlayerModel } from "../Models/PlayerModel";
import { validate } from "class-validator";
import multer from "multer";
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "../../.env") });
const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

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
      player.imageUrl = player.imageUrl
        ? `${SERVER_ADDRESS}/uploads/${player.imageUrl}`
        : null;
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
    player!.imageUrl = player!.imageUrl
      ? `${SERVER_ADDRESS}/uploads/${player!.imageUrl}`
      : null;

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
  const imageUrl = req.file ? `${req.file.filename}` : null;

  const player = new PlayerModel(
    name,
    new Date(age),
    parseFloat(height),
    mainPosition,
    subPosition || null,
    0, // APass
    0, // BPass
    0, // CPass
    0, // passErrors
    0, // ASet
    0, // BSet
    0, // CSet
    0, // setErrors
    0, // kills
    0, // attackErrors
    0, // attackAttempts
    0, // aces
    0, // serveErrors
    0, // serveAttempts
    0, // soloBlocks
    0, // assistBlocks
    0, // blockErrors
    0, // digs
    0, // digAttempts
    0, // setsPlayed
    0, // matchesPlayed
    0, // yellowCards
    0, // redCards
    0, // greenCards
    0, // points
    0, // blockPoints
    0, // servePoints
    0, // spikePoints
    false, // retired
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
    passErrors,
    ASet,
    BSet,
    CSet,
    setErrors,
    kills,
    attackErrors,
    attackAttempts,
    aces,
    serveErrors,
    serveAttempts,
    soloBlocks,
    assistBlocks,
    blockErrors,
    digs,
    digAttempts,
    setsPlayed,
    matchesPlayed,
    yellowCards,
    redCards,
    greenCards,
    points,
    blockPoints,
    servePoints,
    spikePoints,
    retired,
  } = req.body;

  const imageUrl = req.file ? `${req.file.filename}` : null;

  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("players");

    const result = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      res.status(404).send("Player not found");
      return;
    }

    const player = new PlayerModel(
      result.name,
      result.age,
      result.height,
      result.mainPosition,
      result.subPosition || null,
      result.APass || 0,
      result.BPass || 0,
      result.CPass || 0,
      result.passErrors || 0,
      result.ASet || 0,
      result.BSet || 0,
      result.CSet || 0,
      result.setErrors || 0,
      result.kills || 0,
      result.attackErrors || 0,
      result.attackAttempts || 0,
      result.aces || 0,
      result.serveErrors || 0,
      result.serveAttempts || 0,
      result.soloBlocks || 0,
      result.assistBlocks || 0,
      result.blockErrors || 0,
      result.digs || 0,
      result.digAttempts || 0,
      result.setsPlayed || 0,
      result.matchesPlayed || 0,
      result.yellowCards || 0,
      result.redCards || 0,
      result.greenCards || 0,
      result.points || 0,
      result.blockPoints || 0,
      result.servePoints || 0,
      result.spikePoints || 0,
      result.retired || false,
      result.imageUrl
    );

    // Update basic info
    if (name) player.setName(name);
    if (age) player.setAge(new Date(age));
    if (height) player.setHeight(parseFloat(height));
    if (mainPosition) player.setMainPosition(mainPosition);
    if (subPosition) player.setSubPosition(subPosition);

    // Update reception stats
    if (APass !== undefined) player.setAPass(parseInt(APass));
    if (BPass !== undefined) player.setBPass(parseInt(BPass));
    if (CPass !== undefined) player.setCPass(parseInt(CPass));
    if (passErrors !== undefined) player.setPassErrors(parseInt(passErrors));

    // Update setting stats
    if (ASet !== undefined) player.setASet(parseInt(ASet));
    if (BSet !== undefined) player.setBSet(parseInt(BSet));
    if (CSet !== undefined) player.setCSet(parseInt(CSet));
    if (setErrors !== undefined) player.setSetErrors(parseInt(setErrors));

    // Update attack stats
    if (kills !== undefined) player.setKills(parseInt(kills));
    if (attackErrors !== undefined)
      player.setAttackErrors(parseInt(attackErrors));
    if (attackAttempts !== undefined)
      player.setAttackAttempts(parseInt(attackAttempts));

    // Update serve stats
    if (aces !== undefined) player.setAces(parseInt(aces));
    if (serveErrors !== undefined) player.setServeErrors(parseInt(serveErrors));
    if (serveAttempts !== undefined)
      player.setServeAttempts(parseInt(serveAttempts));

    // Update block stats
    if (soloBlocks !== undefined) player.setSoloBlocks(parseInt(soloBlocks));
    if (assistBlocks !== undefined)
      player.setAssistBlocks(parseInt(assistBlocks));
    if (blockErrors !== undefined) player.setBlockErrors(parseInt(blockErrors));

    // Update dig stats
    if (digs !== undefined) player.setDigs(parseInt(digs));
    if (digAttempts !== undefined) player.setDigAttempts(parseInt(digAttempts));

    // Update game stats
    if (setsPlayed !== undefined) player.setSetsPlayed(parseInt(setsPlayed));
    if (matchesPlayed !== undefined)
      player.setMatchesPlayed(parseInt(matchesPlayed));

    // Update disciplinary stats
    if (yellowCards !== undefined) player.setYellowCards(parseInt(yellowCards));
    if (redCards !== undefined) player.setRedCards(parseInt(redCards));
    if (greenCards !== undefined) player.setGreenCards(parseInt(greenCards));

    // Update legacy fields
    if (points !== undefined) player.setPoints(parseInt(points));
    if (blockPoints !== undefined) player.setBlockPoints(parseInt(blockPoints));
    if (servePoints !== undefined) player.setServePoints(parseInt(servePoints));
    if (spikePoints !== undefined) player.setSpikePoints(parseInt(spikePoints));

    if (retired !== undefined) player.setRetired(retired);
    if (imageUrl) player.setImageUrl(imageUrl);

    // Validate the updated player
    const errors = await validate(player);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: player }
    );

    if (updateResult.modifiedCount === 1) {
      res.status(200).send("Player updated successfully");
    } else {
      res.status(500).send("Error updating player");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getPlayerStats = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("players");
    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      res.status(404).send("Player not found");
      return;
    }

    // Create PlayerModel instance to calculate advanced stats
    const player = new PlayerModel(
      result.name,
      result.age,
      result.height,
      result.mainPosition,
      result.subPosition || null,
      result.APass || 0,
      result.BPass || 0,
      result.CPass || 0,
      result.passErrors || 0,
      result.ASet || 0,
      result.BSet || 0,
      result.CSet || 0,
      result.setErrors || 0,
      result.kills || 0,
      result.attackErrors || 0,
      result.attackAttempts || 0,
      result.aces || 0,
      result.serveErrors || 0,
      result.serveAttempts || 0,
      result.soloBlocks || 0,
      result.assistBlocks || 0,
      result.blockErrors || 0,
      result.digs || 0,
      result.digAttempts || 0,
      result.setsPlayed || 0,
      result.matchesPlayed || 0,
      result.yellowCards || 0,
      result.redCards || 0,
      result.greenCards || 0,
      result.points || 0,
      result.blockPoints || 0,
      result.servePoints || 0,
      result.spikePoints || 0,
      result.retired || false,
      result.imageUrl
    );

    const advancedStats = player.getAdvancedStats();

    res.status(200).json({
      playerId: result._id,
      playerName: result.name,
      position: result.mainPosition,
      stats: advancedStats,
    });
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
