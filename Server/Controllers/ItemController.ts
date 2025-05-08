import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { validate } from "class-validator";
import { ItemFactory } from "../Factory/ItemFactory";

export const getItem = async (req: Request, res: Response) => {
  try {
    const { name, mainPositions, type, limit, skip, priceMin, priceMax } =
      req.query;
    const collection = await req.mongoDB!.getCollection("items");

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

    if (type) {
      filters.type = type;
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) {
        filters.price.$gte = parseFloat(priceMin as string);
      }
      if (priceMax) {
        filters.price.$lte = parseFloat(priceMax as string);
      }
    }

    const items = await collection
      .find(filters)
      // .skip(Number(skip) || 0)
      // .limit(Number(limit) || 20)
      .toArray();

    res.status(200).json(items);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Failed to fetch items", details: error.message });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const collection = await req.mongoDB!.getCollection("items");

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid ID format" });
    }

    const item = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (item) {
      res.status(201).json(item);
    } else {
      res.status(404).send("item Not Found");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const createItem = async (req: Request, res: Response) => {
  const { type, baseAttributes, specificAttributes } = req.body;

  const imageUrl = req.file
  ? `https://solid-tribble-g6xr9gvpj76hr5g-3000.app.github.dev/uploads/${req.file.filename}`
  : null;

  baseAttributes.image = imageUrl;

  const item = ItemFactory.createItem(type, baseAttributes, specificAttributes);

  const errors = await validate(item);
  if (errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("items");

    if (await collection.insertOne(item)) {
      res.status(201).send("Item created successfully");
    } else {
      res.status(500).send("Error creating item");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const collection = await req.mongoDB!.getCollection("items");

    const existingItem = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingItem) {
      res.status(404).send("Item not found");
    }

    const {
      name,
      description,
      price,
      amount,
      brand,
      type,
      specificAttributes,
    } = req.body;

    const updatedFields: any = {};

    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (price) updatedFields.price = parseFloat(price);
    if (amount) updatedFields.amount = parseInt(amount, 10);
    if (brand) updatedFields.brand = brand;
    if (type) updatedFields.type = type;

    if (specificAttributes) {
      updatedFields.specificAttributes = specificAttributes;
    }

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (updateResult.modifiedCount > 0) {
      res.status(200).send("Item updated successfully");
    } else {
      res.status(500).send("Failed to update item");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const collection = await req.mongoDB!.getCollection("items");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      res.status(200).send("item deleted successfully");
    } else {
      res.status(404).send("Error deleting item");
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
