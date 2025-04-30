import { ItemModel } from "./ItemModel";

export class SaleModel {
    private item!: ItemModel;
    private quantity!: number;
    private totalPrice!: number;
    private date!: Date;
  
    constructor(item: ItemModel, quantity: number, totalPrice: number) {
      this.item = item;
      this.quantity = quantity;
      this.totalPrice = totalPrice;
      this.date = new Date();
    }
  
    public getItem(): ItemModel {
      return this.item;
    }
  
    public getQuantity(): number {
      return this.quantity;
    }
  
    public getTotalPrice(): number {
      return this.totalPrice;
    }
  
    public getDate(): Date {
      return this.date;
    }
  }