import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export const addPlayerToTeam = async (req: Request, res: Response) => {
  const { playerId, teamId } = req.body;

  console.log("addPlayerToTeam", playerId, teamId);

  if (!ObjectId.isValid(playerId) || !ObjectId.isValid(teamId)) {
    res.status(400).send("Invalid playerId or teamId");
    return;
  }

  try {
    const playersTeamsCollection = await req.mongoDB!.getCollection("players_teams");

    const existingRelation = await playersTeamsCollection.findOne({
      playerId,
      teamId,
    });

    if (existingRelation) {
      res.status(400).send("Jogador já está no time");
      return;
    }

    await playersTeamsCollection.insertOne({
      playerId,
      teamId,
      joinedAt: new Date(),
    });

    res.status(201).send("Player added to team successfully");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const removePlayerFromTeam = async (req: Request, res: Response) => {
  const { playerId, teamId } = req.body;

  if (!ObjectId.isValid(playerId) || !ObjectId.isValid(teamId)) {
    res.status(400).send("Invalid playerId or teamId");
    return;
  }

  try {
    const playersTeamsCollection = await req.mongoDB!.getCollection("players_teams");

    const deleteResult = await playersTeamsCollection.deleteOne({
      playerId,
      teamId,
    });

    if (deleteResult.deletedCount === 0) {
      res.status(404).send("Jogador não encontrado no time");
      return;
    }

    res.status(200).send("Player removed from team successfully");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getTeamsForPlayer = async (req: Request, res: Response) => {
  const { playerId } = req.params;

  if (!ObjectId.isValid(playerId)) {
    res.status(400).send("Invalid playerId");
    return;
  }

  try {
    const playersTeamsCollection = await req.mongoDB!.getCollection("players_teams");

    const teams = await playersTeamsCollection.find({ playerId }).toArray();

    res.status(200).json(teams);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getPlayersForTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;

  if (!ObjectId.isValid(teamId)) {
    res.status(400).send("Invalid teamId");
    return;
  }

  try {
    const playersTeamsCollection = await req.mongoDB!.getCollection("players_teams");

    const players = await playersTeamsCollection.find({ teamId }).toArray();

    res.status(200).json(players);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};