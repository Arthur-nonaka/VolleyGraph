import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { MatchModel } from "../Models/MatchModel";
import { TeamModel } from "../Models/TeamModel";
import { validate } from "class-validator";

export const getMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const matchCollection = await req.mongoDB!.getCollection("matches");
    const teamCollection = await req.mongoDB!.getCollection("teams");
    
    const matches = await matchCollection.find({}).toArray();
    
    const populatedMatches = await Promise.all(
      matches.map(async (match) => {
        let homeTeamData = null;
        let awayTeamData = null;
        
        if (match.homeTeam && typeof match.homeTeam === 'string') {
          try {
            homeTeamData = await teamCollection.findOne({ _id: new ObjectId(match.homeTeam) });
          } catch (err) {
            console.error('Error fetching home team:', err);
          }
        } else {
          homeTeamData = match.homeTeam;
        }
        
        if (match.awayTeam && typeof match.awayTeam === 'string') {
          try {
            awayTeamData = await teamCollection.findOne({ _id: new ObjectId(match.awayTeam) });
          } catch (err) {
            console.error('Error fetching away team:', err);
          }
        } else {
          awayTeamData = match.awayTeam;
        }
        
        return {
          ...match,
          homeTeam: homeTeamData,
          awayTeam: awayTeamData
        };
      })
    );
    
    res.status(200).json(populatedMatches);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getMatchById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    const matchCollection = await req.mongoDB!.getCollection("matches");
    const teamCollection = await req.mongoDB!.getCollection("teams");
    
    const match = await matchCollection.findOne({ _id: new ObjectId(id) });

    if (!match) {
      res.status(404).send("Match not found");
      return;
    }

    let homeTeamData = null;
    let awayTeamData = null;
    
    if (match.homeTeam && typeof match.homeTeam === 'string') {
      try {
        homeTeamData = await teamCollection.findOne({ _id: new ObjectId(match.homeTeam) });
      } catch (err) {
        console.error('Error fetching home team:', err);
      }
    } else {
      homeTeamData = match.homeTeam;
    }
    
    if (match.awayTeam && typeof match.awayTeam === 'string') {
      try {
        awayTeamData = await teamCollection.findOne({ _id: new ObjectId(match.awayTeam) });
      } catch (err) {
        console.error('Error fetching away team:', err);
      }
    } else {
      awayTeamData = match.awayTeam;
    }
    
    const populatedMatch = {
      ...match,
      homeTeam: homeTeamData,
      awayTeam: awayTeamData
    };

    res.status(200).json(populatedMatch);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { homeTeamId, awayTeamId, date, location } = req.body;

  try {
    const teamCollection = await req.mongoDB!.getCollection("teams");

    if (!ObjectId.isValid(homeTeamId) || !ObjectId.isValid(awayTeamId)) {
      res.status(400).json({ error: "Invalid team ID format" });
      return;
    }
    
    const homeTeam = await teamCollection.findOne({ _id: new ObjectId(homeTeamId) });
    const awayTeam = await teamCollection.findOne({ _id: new ObjectId(awayTeamId) });
    
    if (!homeTeam || !awayTeam) {
      res.status(404).json({ error: "One or both teams not found" });
      return;
    }

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
      res.status(400).json(errors);
      return;
    }

    const matchCollection = await req.mongoDB!.getCollection("matches");
    await matchCollection.insertOne(match);
    res.status(201).send("Match created successfully");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { homeTeamScore, awayTeamScore, playersStats } = req.body;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("matches");
    const match = await collection.findOne({ _id: new ObjectId(id) });
    if (!match) {
      res.status(404).send("Match not found");
      return;
    }

    const updateData: any = {};
    if (homeTeamScore !== undefined) updateData.homeTeamScore = homeTeamScore;
    if (awayTeamScore !== undefined) updateData.awayTeamScore = awayTeamScore;

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (playersStats && Array.isArray(playersStats)) {
      const playerCollection = await req.mongoDB!.getCollection("players");
      for (const stat of playersStats) {
        const {
          playerId,
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
        } = stat;

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

export const deleteMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
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
