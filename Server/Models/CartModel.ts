import { IsString, IsNumber, IsOptional, Min, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import "reflect-metadata";

export class CartItem {
  @IsString({ message: "O ID do item deve ser uma string." })
  private itemId!: string;

  @IsString({ message: "O nome do item deve ser uma string." })
  private itemName!: string;

  @IsNumber({}, { message: "O preço deve ser um número." })
  @Min(0, { message: "O preço não pode ser negativo." })
  private price!: number;

  @IsNumber({}, { message: "A quantidade deve ser um número." })
  @Min(1, { message: "A quantidade deve ser pelo menos 1." })
  private quantity!: number;

  @IsString({ message: "A cor selecionada deve ser uma string." })
  @IsOptional()
  private selectedColor?: string;

  @IsString({ message: "O tamanho selecionado deve ser uma string." })
  @IsOptional()
  private selectedSize?: string;

  @IsString({ message: "A imagem deve ser uma string." })
  @IsOptional()
  private image?: string | null;

  constructor(
    itemId: string,
    itemName: string,
    price: number,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
    image?: string | null
  ) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.price = price;
    this.quantity = quantity;
    this.selectedColor = selectedColor;
    this.selectedSize = selectedSize;
    this.image = image;
  }

  // Getters
  public getItemId(): string {
    return this.itemId;
  }

  public getItemName(): string {
    return this.itemName;
  }

  public getPrice(): number {
    return this.price;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getSelectedColor(): string | undefined {
    return this.selectedColor;
  }

  public getSelectedSize(): string | undefined {
    return this.selectedSize;
  }

  public getImage(): string | null | undefined {
    return this.image;
  }

  // Setters
  public setItemId(itemId: string): void {
    this.itemId = itemId;
  }

  public setItemName(itemName: string): void {
    this.itemName = itemName;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  public setSelectedColor(selectedColor: string): void {
    this.selectedColor = selectedColor;
  }

  public setSelectedSize(selectedSize: string): void {
    this.selectedSize = selectedSize;
  }

  public setImage(image: string | null): void {
    this.image = image;
  }

  // Helper methods
  public getTotalPrice(): number {
    return this.price * this.quantity;
  }

  public isSameItem(itemId: string, selectedColor?: string, selectedSize?: string): boolean {
    return (
      this.itemId === itemId &&
      this.selectedColor === selectedColor &&
      this.selectedSize === selectedSize
    );
  }
}

export class CartModel {
  @IsString({ message: "O ID do usuário deve ser uma string." })
  private userId!: string;

  @IsArray({ message: "Os itens devem ser um array." })
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  private items!: CartItem[];

  @IsString({ message: "O cupom deve ser uma string." })
  @IsOptional()
  private couponCode?: string;

  @IsNumber({}, { message: "O desconto deve ser um número." })
  @Min(0, { message: "O desconto não pode ser negativo." })
  @IsOptional()
  private discount?: number;

  private createdAt!: Date;
  private updatedAt!: Date;

  constructor(userId: string, items: CartItem[] = [], couponCode?: string, discount?: number) {
    this.userId = userId;
    this.items = items;
    this.couponCode = couponCode;
    this.discount = discount || 0;
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

  public getCouponCode(): string | undefined {
    return this.couponCode;
  }

  public getDiscount(): number | undefined {
    return this.discount;
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

  public setCouponCode(couponCode: string): void {
    this.couponCode = couponCode;
    this.updateTimestamp();
  }

  public setDiscount(discount: number): void {
    this.discount = discount;
    this.updateTimestamp();
  }

  // Helper methods
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public addItem(item: CartItem): void {
    const existingItemIndex = this.items.findIndex(existingItem =>
      existingItem.isSameItem(item.getItemId(), item.getSelectedColor(), item.getSelectedSize())
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

  public removeItem(itemId: string, selectedColor?: string, selectedSize?: string): boolean {
    const index = this.items.findIndex(item =>
      item.isSameItem(itemId, selectedColor, selectedSize)
    );

    if (index !== -1) {
      this.items.splice(index, 1);
      this.updateTimestamp();
      return true;
    }
    return false;
  }

  public updateItemQuantity(itemId: string, quantity: number, selectedColor?: string, selectedSize?: string): boolean {
    const item = this.items.find(item =>
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
    this.couponCode = undefined;
    this.discount = 0;
    this.updateTimestamp();
  }

  public getSubtotal(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  public getDiscountAmount(): number {
    if (!this.discount) return 0;
    return (this.getSubtotal() * this.discount) / 100;
  }

  public getTotal(): number {
    return this.getSubtotal() - this.getDiscountAmount();
  }

  public getItemCount(): number {
    return this.items.reduce((total, item) => total + item.getQuantity(), 0);
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public findItem(itemId: string, selectedColor?: string, selectedSize?: string): CartItem | undefined {
    return this.items.find(item =>
      item.isSameItem(itemId, selectedColor, selectedSize)
    );
  }

  public applyCoupon(couponCode: string, discount: number): void {
    this.couponCode = couponCode;
    this.discount = discount;
    this.updateTimestamp();
  }

  public removeCoupon(): void {
    this.couponCode = undefined;
    this.discount = 0;
    this.updateTimestamp();
  }
}
