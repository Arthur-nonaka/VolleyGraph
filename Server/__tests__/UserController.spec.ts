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
import { ObjectId } from "mongodb";

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

    describe("validation", () => {
      const validationTests = [
        {
          name: "email is invalid",
          body: {
            email: "invalid-email",
            password: "password123",
          },
        },
        {
          name: "password is too short",
          body: {
            email: "test@gmail.com",
            password: "short",
          },
        },
      ];

      validationTests.forEach(({ name, body }) => {
        it(name, async () => {
          // Arrange
          req.body = body;

          // Act
          await createUser(req as Request, res as Response);

          // Assert
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
      });
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

  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      // Arrange
      req.body = {
        email: "updated@gmail.com",
        password: "newpassword123",
        id: "507f1f77bcf86cd799439011",
      };

      const existingUser = {
        _id: ObjectId.createFromHexString(req.body.id),
        email: "test@gmail.com",
        password: "password123",
      };

      const collection = {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(existingUser)
          .mockResolvedValueOnce(null),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await updateUser(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(collection.updateOne).toHaveBeenCalledWith(
        { _id: ObjectId.createFromHexString(req.body.id) },
        { $set: expect.any(Object) }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith("User updated successfully");
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      req.body = {
        email: "updated@gmail.com",
        password: "newpassword123",
        id: "507f1f77bcf86cd799439011",
      };

      const collection = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await updateUser(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("User not found");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      req.body = {
        email: "updated@gmail.com",
        password: "newpassword123",
        id: "507f1f77bcf86cd799439011",
      };

      const collection = {
        findOne: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await updateUser(req as Request, res as Response);

      // Assert
      expect(collection.findOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      // Arrange
      req.body = {
        id: "507f1f77bcf86cd799439011",
      };

      const collection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await deleteUser(req as Request, res as Response);

      // Assert
      expect(collection.deleteOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("User deleted successfully");
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      req.body = {
        id: "507f1f77bcf86cd799439011",
      };

      const collection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      };
      mongoDB.getCollection = jest.fn().mockResolvedValue(collection);

      // Act
      await deleteUser(req as Request, res as Response);

      // Assert
      expect(collection.deleteOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Error deleting user");
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
      await deleteUser(req as Request, res as Response);

      // Assert
      expect(collection.deleteOne).toHaveBeenCalledWith({
        _id: ObjectId.createFromHexString(req.body.id),
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Database error");
    });
  });
});
