import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { SaleModel, SaleItem, SaleStatus, PaymentMethod } from "../Models/SaleModel";
import { ResponseMessages } from "../Constants/ResponseMessages";
import { validate } from "class-validator";

export const getSale = async (req: Request, res: Response) => {
  try {
    const { userId, status, startDate, endDate } = req.query;
    const collection = await req.mongoDB!.getCollection("sales");

    const filters: any = {};

    if (userId) {
      filters.userId = userId;
    }

    if (status) {
      filters.status = status;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate as string);
      if (endDate) filters.createdAt.$lte = new Date(endDate as string);
    }

    const sales = await collection.find(filters).sort({ createdAt: -1 }).toArray();

    res.status(200).json(sales);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao buscar vendas", 
      details: error.message 
    });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("sales");
    const sale = await collection.findOne({ _id: new ObjectId(id) });

    if (sale) {
      res.status(200).json(sale);
    } else {
      res.status(404).send(ResponseMessages.SALE_NOT_FOUND);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao buscar venda", 
      details: error.message 
    });
  }
};

export const getSalesByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("sales");
    const sales = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();

    res.status(200).json(sales);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao buscar vendas do usuário", 
      details: error.message 
    });
  }
};

export const createSale = async (req: Request, res: Response) => {
  const { 
    userId, 
    items, 
    subtotal, 
    total, 
    paymentMethod, 
    deliveryAddress,
    discount,
    couponCode,
    notes 
  } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Dados obrigatórios: userId, items" });
    return;
  }

  if (!subtotal || !total || !paymentMethod || !deliveryAddress) {
    res.status(400).json({ error: "Dados obrigatórios: subtotal, total, paymentMethod, deliveryAddress" });
    return;
  }

  try {
    const saleItems = items.map((item: any) => 
      new SaleItem(
        item.itemId,
        item.itemName,
        item.unitPrice,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )
    );

    const sale = new SaleModel(
      userId,
      saleItems,
      subtotal,
      total,
      paymentMethod,
      deliveryAddress,
      discount,
      couponCode,
      SaleStatus.PENDING,
      notes
    );

    const errors = await validate(sale);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    // Validate each sale item
    for (const saleItem of saleItems) {
      const itemErrors = await validate(saleItem);
      if (itemErrors.length > 0) {
        res.status(400).json(itemErrors);
        return;
      }
    }

    const collection = await req.mongoDB!.getCollection("sales");
    const result = await collection.insertOne(sale);

    if (result) {
      res.status(201).json({
        message: ResponseMessages.SALE_CREATED_SUCCESSFULLY,
        saleId: result.insertedId,
        sale: sale,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_CREATING_SALE);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_CREATING_SALE, 
      details: error.message 
    });
  }
};

export const createSaleFromCart = async (req: Request, res: Response) => {
  const { userId, paymentMethod, deliveryAddress, notes } = req.body;

  if (!userId || !paymentMethod || !deliveryAddress) {
    res.status(400).json({ error: "Dados obrigatórios: userId, paymentMethod, deliveryAddress" });
    return;
  }

  try {
    // Get user's cart
    const cartCollection = await req.mongoDB!.getCollection("carts");
    const cart = await cartCollection.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      res.status(400).json({ error: "Carrinho vazio ou não encontrado" });
      return;
    }

    // Convert cart items to sale items
    const saleItems = cart.items.map((item: any) => 
      new SaleItem(
        item.itemId,
        item.itemName,
        item.price,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )
    );

    // Calculate amounts
    const subtotal = saleItems.reduce((total: number, item: SaleItem) => total + item.getTotalPrice(), 0);
    const discount = cart.discount || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const sale = new SaleModel(
      userId,
      saleItems,
      subtotal,
      total,
      paymentMethod,
      deliveryAddress,
      discount,
      cart.couponCode,
      SaleStatus.PENDING,
      notes
    );

    const errors = await validate(sale);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const salesCollection = await req.mongoDB!.getCollection("sales");
    const result = await salesCollection.insertOne(sale);

    if (result) {
      // Clear the cart after successful sale creation
      await cartCollection.updateOne(
        { userId },
        { 
          $set: { 
            items: [], 
            couponCode: null, 
            discount: 0,
            updatedAt: new Date()
          } 
        }
      );

      res.status(201).json({
        message: ResponseMessages.SALE_CREATED_SUCCESSFULLY,
        saleId: result.insertedId,
        sale: sale,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_CREATING_SALE);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_CREATING_SALE, 
      details: error.message 
    });
  }
};

export const updateSaleStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  if (!status || !Object.values(SaleStatus).includes(status)) {
    res.status(400).send(ResponseMessages.INVALID_SALE_STATUS);
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("sales");
    const existingSale = await collection.findOne({ _id: new ObjectId(id) });

    if (!existingSale) {
      res.status(404).send(ResponseMessages.SALE_NOT_FOUND);
      return;
    }

    const saleModel = new SaleModel(
      existingSale.userId,
      existingSale.items?.map((item: any) => new SaleItem(
        item.itemId,
        item.itemName,
        item.unitPrice,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )) || [],
      existingSale.subtotal,
      existingSale.total,
      existingSale.paymentMethod,
      existingSale.deliveryAddress,
      existingSale.discount,
      existingSale.couponCode,
      existingSale.status,
      existingSale.notes
    );

    saleModel.setStatus(status);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: saleModel.getStatus(), updatedAt: saleModel.getUpdatedAt(), deliveredAt: saleModel.getDeliveredAt() } }
    );

    if (result.modifiedCount > 0) {
      let message = ResponseMessages.SALE_UPDATED_SUCCESSFULLY;
      switch (status) {
        case SaleStatus.CONFIRMED:
          message = ResponseMessages.SALE_CONFIRMED_SUCCESSFULLY;
          break;
        case SaleStatus.SHIPPED:
          message = ResponseMessages.SALE_SHIPPED_SUCCESSFULLY;
          break;
        case SaleStatus.DELIVERED:
          message = ResponseMessages.SALE_DELIVERED_SUCCESSFULLY;
          break;
        case SaleStatus.CANCELLED:
          message = ResponseMessages.SALE_CANCELLED_SUCCESSFULLY;
          break;
      }

      res.status(200).json({
        message: message,
        sale: saleModel,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_UPDATING_SALE);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_UPDATING_SALE, 
      details: error.message 
    });
  }
};

export const cancelSale = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("sales");
    const existingSale = await collection.findOne({ _id: new ObjectId(id) });

    if (!existingSale) {
      res.status(404).send(ResponseMessages.SALE_NOT_FOUND);
      return;
    }

    const saleModel = new SaleModel(
      existingSale.userId,
      existingSale.items?.map((item: any) => new SaleItem(
        item.itemId,
        item.itemName,
        item.unitPrice,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )) || [],
      existingSale.subtotal,
      existingSale.total,
      existingSale.paymentMethod,
      existingSale.deliveryAddress,
      existingSale.discount,
      existingSale.couponCode,
      existingSale.status,
      existingSale.notes
    );

    if (!saleModel.canBeCancelled()) {
      res.status(400).send(ResponseMessages.SALE_CANNOT_BE_CANCELLED);
      return;
    }

    saleModel.setStatus(SaleStatus.CANCELLED);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: saleModel.getStatus(), updatedAt: saleModel.getUpdatedAt() } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: ResponseMessages.SALE_CANCELLED_SUCCESSFULLY,
        sale: saleModel,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_CANCELLING_SALE);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_CANCELLING_SALE, 
      details: error.message 
    });
  }
};

export const updateSaleNotes = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("sales");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { notes, updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).send(ResponseMessages.SALE_UPDATED_SUCCESSFULLY);
    } else {
      res.status(404).send(ResponseMessages.SALE_NOT_FOUND);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_UPDATING_SALE, 
      details: error.message 
    });
  }
};

export const getSalesStatistics = async (req: Request, res: Response) => {
  try {
    const collection = await req.mongoDB!.getCollection("sales");

    const totalSales = await collection.countDocuments();
    const totalRevenue = await collection.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]).toArray();

    const salesByStatus = await collection.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();

    const salesByPaymentMethod = await collection.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
    ]).toArray();

    const recentSales = await collection.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const statistics = {
      totalSales,
      totalRevenue: totalRevenue[0]?.total || 0,
      salesByStatus: salesByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      salesByPaymentMethod: salesByPaymentMethod.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentSales,
    };

    res.status(200).json(statistics);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao obter estatísticas de vendas", 
      details: error.message 
    });
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("sales");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).send("Venda deletada com sucesso");
    } else {
      res.status(404).send(ResponseMessages.SALE_NOT_FOUND);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao deletar venda", 
      details: error.message 
    });
  }
};
