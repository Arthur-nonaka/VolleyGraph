import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TeamModel } from "../Models/TeamModel";
import { validate } from "class-validator";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

export const getTeam = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.query;
    const collection = await req.mongoDB!.getCollection("teams");

    const filters: any = {};
    if (name) {
      filters.name = { $regex: new RegExp(name as string, "i") };
    }
    if (address) {
      filters.address = { $regex: new RegExp(address as string, "i") };
    }

    const teams = await collection.find(filters).toArray();

    res.status(200).json(teams);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const collection = await req.mongoDB!.getCollection("teams");
    const playerTeamCollection = await req.mongoDB!.getCollection(
      "players_teams"
    );
    const playerCollection = await req.mongoDB!.getCollection("players");

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid ID format" });
    }

    const team = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!team) {
      res.status(404).send("Time não encontrado");
      return;
    }

    const playerTeamRelations = await playerTeamCollection
      .find({ teamId: id })
      .toArray();

    const playerIds = playerTeamRelations.map(
      (relation) => new ObjectId(relation.playerId)
    );

    team.players = await playerCollection
      .find({
        _id: { $in: playerIds },
      })
      .toArray();

    if (team) {
      res.status(201).json(team);
    } else {
      res.status(404).send("Team Not Found");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name, address } = req.body;
  const imageUrl = req.file ? `${req.file.filename}` : null;
  console.log(name, address, imageUrl);

  const team = new TeamModel(name, imageUrl, [], address);

  const errors = await validate(team);
  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("teams");

    if (await collection.insertOne(team)) {
      res.status(201).send("Team created successfully");
    } else {
      res.status(500).send("Error creating Team");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  const { name, address } = req.body;

  const imageUrl = req.file ? `${req.file.filename}` : null;

  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const collection = await req.mongoDB!.getCollection("teams");

    const result = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      res.status(404).send("Team not found");
    }

    const team = new TeamModel(
      name || result!.name,
      address || result!.address,
      [],
      imageUrl || result!.imageUrl
    );

    if (await collection.updateOne({ _id: new ObjectId(id) }, { $set: team })) {
      res.status(201).send("Team updated successfully");
    } else {
      res.status(500).send("Error updating Team");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const collection = await req.mongoDB!.getCollection("teams");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      res.status(200).send("Team deleted successfully");
    } else {
      res.status(404).send("Error deleting Team");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
