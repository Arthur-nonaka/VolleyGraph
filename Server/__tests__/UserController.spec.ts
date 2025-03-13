import e, { Request, Response } from "express";
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../Controllers/UserController";
import { MongoDB } from "../Models/MongoDB";
import { ResponseMessages } from "../Constants/ResponseMessages";

jest.mock("../Models/MongoDB");

describe("UserController", () => {
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
  describe("getUser", () => {
    it("should get all users", async () => {
      // Arrange
      const collection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(["user1", "user2"]),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      //Act
      await getUser(req as Request, res as Response);

      //Assert
      expect(collection.find).toHaveBeenCalledWith();
      expect(collection.toArray).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(["user1", "user2"]);
    });
    it("should return an empty array", async () => {
      // Arrange
      const collection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      //Act
      await getUser(req as Request, res as Response);

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
      await getUser(req as Request, res as Response);

      // Assert
      expect(collection.find).toHaveBeenCalledWith();
      expect(collection.toArray).toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("An error occurred");
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      // Arrange
      req.body = {
        email: "test@gmail.com",
        password: "password123",
      };

      const collection = {
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: jest.fn().mockResolvedValue({ insertedId: "123" }),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      //Act
      await createUser(req as Request, res as Response);

      //Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        email: "test@gmail.com",
      });
      expect(collection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@gmail.com",
          password: expect.any(String),
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        ResponseMessages.USER_CREATED_SUCCESSFULLY
      );
    });
    it("should return 400 if user already exists", async () => {
      // Arrange
      req.body = {
        email: "test@gmail.com",
        password: "password123",
      };

      const collection = {
        findOne: jest.fn().mockResolvedValue({ email: "test@gmail.com" }),
        insertOne: jest.fn(),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await createUser(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        email: "test@gmail.com",
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        ResponseMessages.USER_ALREADY_EXISTS
      );
    });

    it("should return 400 if validation fails", async () => {
      // Arrange
      req.body = {
        email: "invalid-email",
        password: "short",
      };

      // Act
      await createUser(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      req.body = {
        email: "test@gmail.com",
        password: "password123",
      };

      const collection = {
        findOne: jest.fn().mockRejectedValue(new Error("Database error")),
        insertOne: jest.fn(),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await createUser(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        email: "test@gmail.com",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });

  describe("updateUser", () => {});

  describe("deleteUser", () => {});
});
