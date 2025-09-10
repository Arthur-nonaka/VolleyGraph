import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import "reflect-metadata";
import { CartItem } from "./CartItemModel";

export class CartModel {
  @IsString({ message: "O ID do usuário deve ser uma string." })
  private userId!: string;

  @IsArray({ message: "Os itens devem ser um array." })
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  private items!: CartItem[];

  private createdAt!: Date;
  private updatedAt!: Date;

  constructor(userId: string, items: CartItem[] = []) {
    this.userId = userId;
    this.items = items;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Getters
  public getUserId(): string {
    return this.userId;
  }

  public getItems(): CartItem[] {
    return this.items;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters
  public setUserId(userId: string): void {
    this.userId = userId;
    this.updateTimestamp();
  }

  public setItems(items: CartItem[]): void {
    this.items = items;
    this.updateTimestamp();
  }

  // Helper methods
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public addItem(item: CartItem): void {
    const existingItemIndex = this.items.findIndex((existingItem) =>
      existingItem.isSameItem(
        item.getItemId(),
        item.getSelectedColor(),
        item.getSelectedSize()
      )
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const existingItem = this.items[existingItemIndex];
      existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
    } else {
      // Add new item
      this.items.push(item);
    }
    this.updateTimestamp();
  }

  public removeItem(
    itemId: string,
    selectedColor?: string,
    selectedSize?: string
  ): boolean {
    const index = this.items.findIndex((item) =>
      item.isSameItem(itemId, selectedColor, selectedSize)
    );

    if (index !== -1) {
      this.items.splice(index, 1);
      this.updateTimestamp();
      return true;
    }
    return false;
  }

  public updateItemQuantity(
    itemId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ): boolean {
    const item = this.items.find((item) =>
      item.isSameItem(itemId, selectedColor, selectedSize)
    );

    if (item) {
      item.setQuantity(quantity);
      this.updateTimestamp();
      return true;
    }
    return false;
  }

  public clearCart(): void {
    this.items = [];
    this.updateTimestamp();
  }

  public getItemCount(): number {
    return this.items.reduce((total, item) => total + item.getQuantity(), 0);
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public findItem(
    itemId: string,
    selectedColor?: string,
    selectedSize?: string
  ): CartItem | undefined {
    return this.items.find((item) =>
      item.isSameItem(itemId, selectedColor, selectedSize)
    );
  }
}
