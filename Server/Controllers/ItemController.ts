import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { validate } from "class-validator";
import { ItemFactory } from "../Factory/ItemFactory";
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "../../.env") });
const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

export const getItem = async (req: Request, res: Response) => {
  try {
    const { name, priceMin, priceMax, gender, type } = req.query;
    const collection = await req.mongoDB!.getCollection("items");

    const filters: any = {};

    if (name) {
      filters.name = { $regex: new RegExp(name as string, "i") };
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = parseFloat(priceMin as string);
      if (priceMax) filters.price.$lte = parseFloat(priceMax as string);
    }

    if (gender) {
      filters.gender = gender;
    }

    if (type) {
      filters.type = type;
    }

    const items = await collection.find(filters).toArray();

    items.forEach((item) => {
      item.image = item.image
        ? `${SERVER_ADDRESS}/uploads/${item.image}`
        : null;
    });

    res.status(200).json(items);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar itens", details: error.message });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("items");
    const item = await collection.findOne({ _id: new ObjectId(id) });

    if (item) {
      item.image = item.image
        ? `${SERVER_ADDRESS}/uploads/${item.image}`
        : null;
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: "Item não encontrado" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao buscar item", details: error.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const { type } = req.body;
  const specificAttributes = JSON.parse(req.body.specificAttributes);
  const variations = JSON.parse(req.body.variations);
  const baseAttributes = JSON.parse(req.body.baseAttributes);

  try {
    const collection = await req.mongoDB!.getCollection("items");
    const existingItem = await collection.findOne({ _id: new ObjectId(id) });

    if (!existingItem) {
      res.status(404).json({ error: "Item não encontrado" });
      return;
    }

    const imageUrl = req.file
      ? `${req.file.filename}`
      : existingItem.specificAttributes.image;

    specificAttributes.image = imageUrl;

    const updatedData = {
      ...baseAttributes,
      ...specificAttributes,
      variations,
    };

    const updatedItem = ItemFactory.createItem(type, updatedData);

    const errors = await validate(updatedItem);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    if (result.modifiedCount > 0) {
      res.status(200).send("Item atualizado com sucesso");
    } else {
      res.status(500).send("Erro ao atualizar item");
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar item", details: error.message });
  }
};

export const createItem = async (req: Request, res: Response) => {
  const { type } = req.body;
  const specificAttributes = JSON.parse(req.body.specificAttributes);
  const variations = JSON.parse(req.body.variations);
  const baseAttributes = JSON.parse(req.body.baseAttributes);

  const imageUrl = req.file ? `${req.file.filename}` : null;

  baseAttributes.image = imageUrl;

  const data = {
    ...baseAttributes,
    ...specificAttributes,
    variations,
  };

  const item = ItemFactory.createItem(type, data);

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

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("items");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.status(200).send("Item deletado com sucesso");
    } else {
      res.status(404).json({ error: "Item não encontrado" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao deletar item", details: error.message });
  }
};

export const getHighestPriceItem = async (req: Request, res: Response) => {
  try {
    const collection = await req.mongoDB!.getCollection("items");
    const item = await collection.find().sort({ price: -1 }).limit(1).toArray();

    item[0].price = item[0].price + 10;

    if (item.length > 0) {
      item[0].image = item[0].image
        ? `${SERVER_ADDRESS}/uploads/${item[0].image}`
        : null;
      res.status(200).json(item[0]);
    } else {
      res.status(404).json({ error: "Nenhum item encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao buscar item de maior preço",
      details: error.message,
    });
  }
};
