import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { MatchModel } from "../Models/MatchModel";
import { TeamModel } from "../Models/TeamModel";
import { validate } from "class-validator";

// Buscar todas as partidas
export const getMatches = async (req: Request, res: Response) => {
  try {
    const collection = await req.mongoDB!.getCollection("matches");
    const matches = await collection.find({}).toArray();
    res.status(200).json(matches);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Buscar partida por ID
export const getMatchById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const collection = await req.mongoDB!.getCollection("matches");
    const match = await collection.findOne({ _id: new ObjectId(id) });

    if (!match) return res.status(404).send("Match not found");

    res.status(200).json(match);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Criar uma partida
export const createMatch = async (req: Request, res: Response) => {
  const { homeTeam, awayTeam, date, location } = req.body;

  const home = new TeamModel(
    homeTeam.name,
    homeTeam.logo || null,
    homeTeam.players || [],
    homeTeam.address
  );
  const away = new TeamModel(
    awayTeam.name,
    awayTeam.logo || null,
    awayTeam.players || [],
    awayTeam.address
  );

  const match = new MatchModel(home, away, new Date(date), location);

  const errors = await validate(match);
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const collection = await req.mongoDB!.getCollection("matches");
    await collection.insertOne(match);
    res.status(201).send("Match created successfully");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Atualizar partida (placares ou estatísticas)
export const updateMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { homeTeamScore, awayTeamScore, playersStats } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const collection = await req.mongoDB!.getCollection("matches");
    const match = await collection.findOne({ _id: new ObjectId(id) });
    if (!match) return res.status(404).send("Match not found");

    const updateData: any = {};
    if (homeTeamScore !== undefined) updateData.homeTeamScore = homeTeamScore;
    if (awayTeamScore !== undefined) updateData.awayTeamScore = awayTeamScore;

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    // Atualizar estatísticas dos jogadores
    if (playersStats && Array.isArray(playersStats)) {
      const playerCollection = await req.mongoDB!.getCollection("players");
      for (const stat of playersStats) {
        const { playerId, APass, BPass, CPass, ASet, BSet, CSet, points, blockPoints, servePoints, spikePoints } = stat;
        await playerCollection.updateOne(
          { _id: new ObjectId(playerId) },
          {
            $inc: {
              APass: APass || 0,
              BPass: BPass || 0,
              CPass: CPass || 0,
              ASet: ASet || 0,
              BSet: BSet || 0,
              CSet: CSet || 0,
              points: points || 0,
              blockPoints: blockPoints || 0,
              servePoints: servePoints || 0,
              spikePoints: spikePoints || 0,
            },
          }
        );
      }
    }

    res.status(200).send("Match updated successfully");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Deletar partida
export const deleteMatch = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const collection = await req.mongoDB!.getCollection("matches");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).send("Match deleted successfully");
    } else {
      res.status(404).send("Match not found");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
