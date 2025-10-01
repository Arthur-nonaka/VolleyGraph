import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import "reflect-metadata";

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export enum SaleStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PIX = "PIX",
  CASH = "CASH",
}

export class SaleItem {
  @IsString({ message: "O ID do item deve ser uma string." })
  private itemId!: string;

  @IsString({ message: "O nome do item deve ser uma string." })
  private itemName!: string;

  @IsNumber({}, { message: "O preço unitário deve ser um número." })
  @Min(0, { message: "O preço unitário não pode ser negativo." })
  private unitPrice!: number;

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
    unitPrice: number,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
    image?: string | null
  ) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.unitPrice = unitPrice;
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

  public getUnitPrice(): number {
    return this.unitPrice;
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

  public setUnitPrice(unitPrice: number): void {
    this.unitPrice = unitPrice;
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
    return this.unitPrice * this.quantity;
  }
}

export class SaleModel {
  @IsString({ message: "O ID do usuário deve ser uma string." })
  private userId!: string;

  @IsArray({ message: "Os itens devem ser um array." })
  @ValidateNested({ each: true })
  @Type(() => SaleItem)
  private items!: SaleItem[];

  @IsNumber({}, { message: "O subtotal deve ser um número." })
  @Min(0, { message: "O subtotal não pode ser negativo." })
  private subtotal!: number;

  @IsNumber({}, { message: "O desconto deve ser um número." })
  @Min(0, { message: "O desconto não pode ser negativo." })
  @IsOptional()
  private discount?: number;

  @IsString({ message: "O cupom deve ser uma string." })
  @IsOptional()
  private couponCode?: string;

  @IsNumber({}, { message: "O total deve ser um número." })
  @Min(0, { message: "O total não pode ser negativo." })
  private total!: number;

  @IsEnum(SaleStatus, { message: "Status de venda inválido." })
  private status!: SaleStatus;

  @IsEnum(PaymentMethod, { message: "Método de pagamento inválido." })
  private paymentMethod!: PaymentMethod;

  @IsObject({ message: "O endereço de entrega deve ser um objeto válido." })
  @ValidateNested()
  private deliveryAddress!: DeliveryAddress;

  @IsString({ message: "As observações devem ser uma string." })
  @IsOptional()
  private notes?: string;

  private createdAt!: Date;
  private updatedAt!: Date;
  private deliveredAt?: Date;

  constructor(
    userId: string,
    items: SaleItem[],
    subtotal: number,
    total: number,
    paymentMethod: PaymentMethod,
    deliveryAddress: DeliveryAddress,
    discount?: number,
    couponCode?: string,
    status: SaleStatus = SaleStatus.PENDING,
    notes?: string
  ) {
    this.userId = userId;
    this.items = items;
    this.subtotal = subtotal;
    this.discount = discount || 0;
    this.couponCode = couponCode;
    this.total = total;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.deliveryAddress = deliveryAddress;
    this.notes = notes;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Getters
  public getUserId(): string {
    return this.userId;
  }

  public getItems(): SaleItem[] {
    return this.items;
  }

  public getSubtotal(): number {
    return this.subtotal;
  }

  public getDiscount(): number | undefined {
    return this.discount;
  }

  public getCouponCode(): string | undefined {
    return this.couponCode;
  }

  public getTotal(): number {
    return this.total;
  }

  public getStatus(): SaleStatus {
    return this.status;
  }

  public getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  public getDeliveryAddress(): DeliveryAddress {
    return this.deliveryAddress;
  }

  public getNotes(): string | undefined {
    return this.notes;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeliveredAt(): Date | undefined {
    return this.deliveredAt;
  }

  // Setters
  public setUserId(userId: string): void {
    this.userId = userId;
    this.updateTimestamp();
  }

  public setItems(items: SaleItem[]): void {
    this.items = items;
    this.updateTimestamp();
  }

  public setSubtotal(subtotal: number): void {
    this.subtotal = subtotal;
    this.updateTimestamp();
  }

  public setDiscount(discount: number): void {
    this.discount = discount;
    this.updateTimestamp();
  }

  public setCouponCode(couponCode: string): void {
    this.couponCode = couponCode;
    this.updateTimestamp();
  }

  public setTotal(total: number): void {
    this.total = total;
    this.updateTimestamp();
  }

  public setStatus(status: SaleStatus): void {
    this.status = status;
    if (status === SaleStatus.DELIVERED) {
      this.deliveredAt = new Date();
    }
    this.updateTimestamp();
  }

  public setPaymentMethod(paymentMethod: PaymentMethod): void {
    this.paymentMethod = paymentMethod;
    this.updateTimestamp();
  }

  public setDeliveryAddress(deliveryAddress: DeliveryAddress): void {
    this.deliveryAddress = deliveryAddress;
    this.updateTimestamp();
  }

  public setNotes(notes: string): void {
    this.notes = notes;
    this.updateTimestamp();
  }

  // Helper methods
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public calculateSubtotal(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  public calculateDiscountAmount(): number {
    if (!this.discount) return 0;
    return (this.subtotal * this.discount) / 100;
  }

  public calculateTotal(): number {
    return this.subtotal - this.calculateDiscountAmount();
  }

  public getItemCount(): number {
    return this.items.reduce((total, item) => total + item.getQuantity(), 0);
  }

  public addItem(item: SaleItem): void {
    this.items.push(item);
    this.recalculateAmounts();
  }

  public removeItem(index: number): boolean {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.recalculateAmounts();
      return true;
    }
    return false;
  }

  public recalculateAmounts(): void {
    this.subtotal = this.calculateSubtotal();
    this.total = this.calculateTotal();
    this.updateTimestamp();
  }

  public isPending(): boolean {
    return this.status === SaleStatus.PENDING;
  }

  public isConfirmed(): boolean {
    return this.status === SaleStatus.CONFIRMED;
  }

  public isShipped(): boolean {
    return this.status === SaleStatus.SHIPPED;
  }

  public isDelivered(): boolean {
    return this.status === SaleStatus.DELIVERED;
  }

  public isCancelled(): boolean {
    return this.status === SaleStatus.CANCELLED;
  }

  public canBeCancelled(): boolean {
    return (
      this.status === SaleStatus.PENDING || this.status === SaleStatus.CONFIRMED
    );
  }

  public getStatusDescription(): string {
    switch (this.status) {
      case SaleStatus.PENDING:
        return "Aguardando confirmação";
      case SaleStatus.CONFIRMED:
        return "Confirmado";
      case SaleStatus.SHIPPED:
        return "Enviado";
      case SaleStatus.DELIVERED:
        return "Entregue";
      case SaleStatus.CANCELLED:
        return "Cancelado";
      default:
        return "Status desconhecido";
    }
  }

  public getPaymentMethodDescription(): string {
    switch (this.paymentMethod) {
      case PaymentMethod.CREDIT_CARD:
        return "Cartão de Crédito";
      case PaymentMethod.DEBIT_CARD:
        return "Cartão de Débito";
      case PaymentMethod.PIX:
        return "PIX";
      case PaymentMethod.CASH:
        return "Dinheiro";
      default:
        return "Método desconhecido";
    }
  }
}
