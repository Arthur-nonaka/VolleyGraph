import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { CartModel, CartItem } from "../Models/CartModel";
import { ResponseMessages } from "../Constants/ResponseMessages";
import { validate } from "class-validator";

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const cart = await collection.findOne({ userId });

    if (cart) {
      res.status(200).json(cart);
    } else {
      // Create empty cart if none exists
      const newCart = new CartModel(userId);
      const errors = await validate(newCart);
      if (errors.length > 0) {
        res.status(400).json(errors);
        return;
      }

      await collection.insertOne(newCart);
      res.status(200).json(newCart);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao buscar carrinho", 
      details: error.message 
    });
  }
};

export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const carts = await collection.find().toArray();

    res.status(200).json(carts);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao buscar carrinhos", 
      details: error.message 
    });
  }
};

export const createCart = async (req: Request, res: Response) => {
  const { userId, items, couponCode, discount } = req.body;

  if (!userId) {
    res.status(400).json({ error: "ID do usuário é obrigatório" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    
    // Check if cart already exists for this user
    const existingCart = await collection.findOne({ userId });
    if (existingCart) {
      res.status(400).json({ error: "Carrinho já existe para este usuário" });
      return;
    }

    const cartItems = items ? items.map((item: any) => 
      new CartItem(
        item.itemId,
        item.itemName,
        item.price,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )
    ) : [];

    const cart = new CartModel(userId, cartItems, couponCode, discount);

    const errors = await validate(cart);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    const result = await collection.insertOne(cart);
    if (result) {
      res.status(201).json({
        message: ResponseMessages.CART_CREATED_SUCCESSFULLY,
        cartId: result.insertedId,
      });
    } else {
      res.status(500).send("Erro ao criar carrinho");
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao criar carrinho", 
      details: error.message 
    });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { itemId, itemName, price, quantity, selectedColor, selectedSize, image } = req.body;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  if (!itemId || !itemName || price === undefined || !quantity) {
    res.status(400).json({ error: "Dados do item são obrigatórios" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const existingCart = await collection.findOne({ userId });

    let cartModel: CartModel;

    if (!existingCart) {
      // Create new cart if none exists
      cartModel = new CartModel(userId);
    } else {
      // Convert to CartModel instance
      cartModel = new CartModel(
        existingCart.userId,
        existingCart.items?.map((item: any) => new CartItem(
          item.itemId,
          item.itemName,
          item.price,
          item.quantity,
          item.selectedColor,
          item.selectedSize,
          item.image
        )) || [],
        existingCart.couponCode,
        existingCart.discount
      );
    }

    const newItem = new CartItem(
      itemId,
      itemName,
      price,
      quantity,
      selectedColor,
      selectedSize,
      image
    );

    const errors = await validate(newItem);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    cartModel.addItem(newItem);

    const cartErrors = await validate(cartModel);
    if (cartErrors.length > 0) {
      res.status(400).json(cartErrors);
      return;
    }

    const result = await collection.replaceOne(
      { userId },
      cartModel,
      { upsert: true }
    );

    if (result) {
      res.status(200).json({
        message: ResponseMessages.ITEM_ADDED_TO_CART,
        cart: cartModel,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_ADDING_ITEM_TO_CART);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_ADDING_ITEM_TO_CART, 
      details: error.message 
    });
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { itemId, selectedColor, selectedSize } = req.body;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  if (!itemId) {
    res.status(400).json({ error: "ID do item é obrigatório" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const cart = await collection.findOne({ userId });

    if (!cart) {
      res.status(404).send(ResponseMessages.CART_NOT_FOUND);
      return;
    }

    const cartModel = new CartModel(
      cart.userId,
      cart.items?.map((item: any) => new CartItem(
        item.itemId,
        item.itemName,
        item.price,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )) || [],
      cart.couponCode,
      cart.discount
    );

    const removed = cartModel.removeItem(itemId, selectedColor, selectedSize);

    if (!removed) {
      res.status(404).send(ResponseMessages.ITEM_NOT_FOUND_IN_CART);
      return;
    }

    const result = await collection.replaceOne({ userId }, cartModel);

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: ResponseMessages.ITEM_REMOVED_FROM_CART,
        cart: cartModel,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_REMOVING_ITEM_FROM_CART);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_REMOVING_ITEM_FROM_CART, 
      details: error.message 
    });
  }
};

export const updateItemQuantity = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { itemId, quantity, selectedColor, selectedSize } = req.body;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  if (!itemId || quantity === undefined || quantity < 1) {
    res.status(400).json({ error: "ID do item e quantidade válida são obrigatórios" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const cart = await collection.findOne({ userId });

    if (!cart) {
      res.status(404).send(ResponseMessages.CART_NOT_FOUND);
      return;
    }

    const cartModel = new CartModel(
      cart.userId,
      cart.items?.map((item: any) => new CartItem(
        item.itemId,
        item.itemName,
        item.price,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )) || [],
      cart.couponCode,
      cart.discount
    );

    const updated = cartModel.updateItemQuantity(itemId, quantity, selectedColor, selectedSize);

    if (!updated) {
      res.status(404).send(ResponseMessages.ITEM_NOT_FOUND_IN_CART);
      return;
    }

    const result = await collection.replaceOne({ userId }, cartModel);

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: ResponseMessages.CART_UPDATED_SUCCESSFULLY,
        cart: cartModel,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_UPDATING_CART);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_UPDATING_CART, 
      details: error.message 
    });
  }
};

export const applyCouponToCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { couponCode, discount } = req.body;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  if (!couponCode || discount === undefined || discount < 0 || discount > 100) {
    res.status(400).json({ error: "Código do cupom e desconto válido são obrigatórios" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const cart = await collection.findOne({ userId });

    if (!cart) {
      res.status(404).send(ResponseMessages.CART_NOT_FOUND);
      return;
    }

    const cartModel = new CartModel(
      cart.userId,
      cart.items?.map((item: any) => new CartItem(
        item.itemId,
        item.itemName,
        item.price,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )) || [],
      cart.couponCode,
      cart.discount
    );

    cartModel.applyCoupon(couponCode, discount);

    const result = await collection.replaceOne({ userId }, cartModel);

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: ResponseMessages.COUPON_APPLIED_SUCCESSFULLY,
        cart: cartModel,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_APPLYING_COUPON);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_APPLYING_COUPON, 
      details: error.message 
    });
  }
};

export const removeCouponFromCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const cart = await collection.findOne({ userId });

    if (!cart) {
      res.status(404).send(ResponseMessages.CART_NOT_FOUND);
      return;
    }

    const cartModel = new CartModel(
      cart.userId,
      cart.items?.map((item: any) => new CartItem(
        item.itemId,
        item.itemName,
        item.price,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )) || [],
      cart.couponCode,
      cart.discount
    );

    cartModel.removeCoupon();

    const result = await collection.replaceOne({ userId }, cartModel);

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: "Cupom removido com sucesso",
        cart: cartModel,
      });
    } else {
      res.status(500).send("Erro ao remover cupom");
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao remover cupom", 
      details: error.message 
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const cart = await collection.findOne({ userId });

    if (!cart) {
      res.status(404).send(ResponseMessages.CART_NOT_FOUND);
      return;
    }

    const cartModel = new CartModel(
      cart.userId,
      [],
      undefined,
      0
    );

    const result = await collection.replaceOne({ userId }, cartModel);

    if (result.modifiedCount > 0) {
      res.status(200).json({
        message: ResponseMessages.CART_CLEARED_SUCCESSFULLY,
        cart: cartModel,
      });
    } else {
      res.status(500).send(ResponseMessages.ERROR_CLEARING_CART);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: ResponseMessages.ERROR_CLEARING_CART, 
      details: error.message 
    });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");

    const result = await collection.deleteOne({ userId });

    if (result.deletedCount === 1) {
      res.status(200).send("Carrinho deletado com sucesso");
    } else {
      res.status(404).send(ResponseMessages.CART_NOT_FOUND);
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao deletar carrinho", 
      details: error.message 
    });
  }
};

export const getCartSummary = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const collection = await req.mongoDB!.getCollection("carts");
    const cart = await collection.findOne({ userId });

    if (!cart) {
      res.status(404).send(ResponseMessages.CART_NOT_FOUND);
      return;
    }

    const cartModel = new CartModel(
      cart.userId,
      cart.items?.map((item: any) => new CartItem(
        item.itemId,
        item.itemName,
        item.price,
        item.quantity,
        item.selectedColor,
        item.selectedSize,
        item.image
      )) || [],
      cart.couponCode,
      cart.discount
    );

    const summary = {
      itemCount: cartModel.getItemCount(),
      subtotal: cartModel.getSubtotal(),
      discountAmount: cartModel.getDiscountAmount(),
      total: cartModel.getTotal(),
      couponCode: cartModel.getCouponCode(),
      discount: cartModel.getDiscount(),
      isEmpty: cartModel.isEmpty(),
    };

    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Erro ao obter resumo do carrinho", 
      details: error.message 
    });
  }
};
