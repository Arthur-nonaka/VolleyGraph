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
import { ObjectId } from "mongodb";

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
    // describe("validation", () => {
    //   const validationTests = [
    //     {
    //       name: "invalid string",
    //       body: {
    //         name: "invalid-email",
    //         "..."
    //       },
    //     },
    //     {
    //       name: "password is too short",
    //       body: {
    //         email: "test@gmail.com",
    //         password: "short",
    //       },
    //     },
    //   ];

    describe("validation", () => {
      const validBody = {
        name: "John Doe",
        age: 25,
        height: 180,
        mainPosition: "Setter",
        subPosition: "Libero",
        APass: 10,
        BPass: 5,
        CPass: 2,
        ASet: 8,
        BSet: 4,
        CSet: 3,
        points: 20,
        blockPoints: 5,
        servePoints: 3,
        spikePoints: 7,
        retired: false,
      };

      const tests = [
        { name: "name is not a string", override: { name: 12345 } },
        { name: "age is below minimum", override: { age: 5 } },
        { name: "age is above maximum", override: { age: 90 } },
        { name: "height is below minimum", override: { height: 50 } },
        { name: "height is above maximum", override: { height: 300 } },
        {
          name: "mainPosition is not a valid enum",
          override: { mainPosition: "InvalidPosition" },
        },
        {
          name: "subPosition is not a valid enum",
          override: { subPosition: "InvalidPosition" },
        },
        {
          name: "subPosition same as mainPosition",
          override: { mainPosition: "Setter", subPosition: "Setter" },
        },
        { name: "APass is negative", override: { APass: -1 } },
        { name: "BPass is negative", override: { BPass: -1 } },
        { name: "CPass is negative", override: { CPass: -1 } },
        { name: "ASet is negative", override: { ASet: -1 } },
        { name: "BSet is negative", override: { BSet: -1 } },
        { name: "CSet is negative", override: { CSet: -1 } },
        { name: "points is negative", override: { points: -1 } },
        { name: "blockPoints is negative", override: { blockPoints: -1 } },
        { name: "servePoints is negative", override: { servePoints: -1 } },
        { name: "spikePoints is negative", override: { spikePoints: -1 } },
        {
          name: "retired is not a boolean",
          override: { retired: "notABoolean" },
        },
      ];

      tests.forEach(({ name, override }) => {
        it(name, async () => {
          req.body = { ...validBody, ...override };

          await createPlayer(req as Request, res as Response);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
      });
    });
    it("should handle database errors gracefully", async () => {
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
        insertOne: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await createPlayer(req as Request, res as Response);

      // Assert
      expect(collection.insertOne).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });

  describe("updatePlayer", () => {
    it("should update a player successfully", async () => {
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
        id: "507f1f77bcf86cd799439011",
      };

      const existingPlayer = {
        _id: ObjectId.createFromHexString(req.body.id),
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
        findOne: jest
          .fn()
          .mockResolvedValueOnce(existingPlayer)
          .mockResolvedValueOnce(null),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await updatePlayer(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(collection.updateOne).toHaveBeenCalledWith(
        { _id: ObjectId.createFromHexString(req.body.id) },
        { $set: expect.any(Object) }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith("Player updated successfully");
    });

    it("should return 404 if player not found", async () => {
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
        id: "507f1f77bcf86cd799439011",
      };

      const collection = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await updatePlayer(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Player not found");
    });

    it("should handle database errors gracefully", async () => {
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
        id: "507f1f77bcf86cd799439011",
      };

      const collection = {
        findOne: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await updatePlayer(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });
  
  describe("deletePlayer", () => {
      it("should delete a player successfully", async () => {
        // Arrange
        req.body = {
          id: "507f1f77bcf86cd799439011",
        };
  
        const collection = {
          deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        };
        mongoDB.getCollection = jest.fn().mockResolvedValue(collection);
  
        // Act
        await deletePlayer(req as Request, res as Response);
  
        // Assert
        expect(collection.deleteOne).toHaveBeenCalledWith({
          _id: ObjectId.createFromHexString(req.body.id),
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("Player deleted successfully");
      });
  
      it("should return 404 if player not found", async () => {
        // Arrange
        req.body = {
          id: "507f1f77bcf86cd799439011",
        };
  
        const collection = {
          deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }),
        };
        mongoDB.getCollection = jest.fn().mockResolvedValue(collection);
  
        // Act
        await deletePlayer(req as Request, res as Response);
  
        // Assert
        expect(collection.deleteOne).toHaveBeenCalledWith({
          _id: ObjectId.createFromHexString(req.body.id),
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Error deleting player");
      });
  
      it("should handle database errors gracefully", async () => {
        // Arrange
        req.body = {
          id: "507f1f77bcf86cd799439011",
        };
  
        const collection = {
          deleteOne: jest.fn().mockRejectedValue(new Error("Database error")),
        };
        mongoDB.getCollection = jest.fn().mockResolvedValue(collection);
  
        // Act
        await deletePlayer(req as Request, res as Response);
  
        // Assert
        expect(collection.deleteOne).toHaveBeenCalledWith({
          _id: ObjectId.createFromHexString(req.body.id),
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Database error");
      });
    });
  });
