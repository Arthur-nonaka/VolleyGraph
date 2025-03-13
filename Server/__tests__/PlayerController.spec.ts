import e, { Request, Response } from "express";
import {
  createPlayer,
  getPlayer,
  getPlayerById,
  updatePlayer,
  deletePlayer,
} from "../Controllers/PlayerController";
import { MongoDB } from "../Models/MongoDB";
import { ResponseMessages } from "../Constants/ResponseMessages";

jest.mock("../Models/MongoDB");

describe("PlayerController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mongoDB: MongoDB;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mongoDB = new MongoDB();
    (req as any).mongoDB = mongoDB;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPlayer", () => {
    it("should get all players", async () => {
      // Arrange
      const collection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(["player1", "player2"]),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      //Act
      await getPlayer(req as Request, res as Response);

      //Assert
      expect(collection.find).toHaveBeenCalledWith();
      expect(collection.toArray).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(["player1", "player2"]);
    });
    it("should return an empty array", async () => {
      // Arrange
      const collection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      //Act
      await getPlayer(req as Request, res as Response);

      //Assert
      expect(collection.find).toHaveBeenCalledWith();
      expect(collection.toArray).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
    it("should return an error", async () => {
      // Arrange
      const collection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockRejectedValue(new Error("An error occurred")),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await getPlayer(req as Request, res as Response);

      // Assert
      expect(collection.find).toHaveBeenCalledWith();
      expect(collection.toArray).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred");
    });
  });

  describe("createPlayer", () => {
    it("should create a player", async () => {
      // Arrange
      req.body = {
        name: "Bruninho",
        age: 32,
        height: 177,
        mainPosition: "Setter",
        subPosition: "Libero",
        APass: 0,
        BPass: 0,
        CPass: 0,
        ASet: 0,
        BSet: 0,
        CSet: 0,
        points: 0,
        blockPoints: 0,
        servePoints: 0,
        spikePoints: 0,
        retired: false,
      };

      const collection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: "123" }),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      //Act
      await createPlayer(req as Request, res as Response);

      //Assert
      expect(collection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Bruninho",
          age: 32,
          height: 177,
          mainPosition: "Setter",
          subPosition: "Libero",
          APass: 0,
          BPass: 0,
          CPass: 0,
          ASet: 0,
          BSet: 0,
          CSet: 0,
          points: 0,
          blockPoints: 0,
          servePoints: 0,
          spikePoints: 0,
          retired: false,
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        ResponseMessages.PLAYER_CREATED_SUCCESSFULLY
      );
    });
  });
});
