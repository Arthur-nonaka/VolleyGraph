import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CartItem {
  @IsString({ message: "O ID do item deve ser uma string." })
  private itemId!: string;

  @IsNumber({}, { message: "A quantidade deve ser um número." })
  @Min(1, { message: "A quantidade deve ser pelo menos 1." })
  private quantity!: number;

  @IsString({ message: "A cor selecionada deve ser uma string." })
  @IsOptional()
  private selectedColor?: string;

  @IsString({ message: "O tamanho selecionado deve ser uma string." })
  @IsOptional()
  private selectedSize?: string;

  constructor(
    itemId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) {
    this.itemId = itemId;
    this.quantity = quantity;
    this.selectedColor = selectedColor;
    this.selectedSize = selectedSize;
  }

  // Getters
  public getItemId(): string {
    return this.itemId;
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

  // Setters
  public setItemId(itemId: string): void {
    this.itemId = itemId;
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

  // Helper methods
  public isSameItem(
    itemId: string,
    selectedColor?: string,
    selectedSize?: string
  ): boolean {
    return (
      this.itemId === itemId &&
      this.selectedColor === selectedColor &&
      this.selectedSize === selectedSize
    );
  }
}
