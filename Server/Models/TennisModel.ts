import { IsString, IsInt, Min } from "class-validator";
import { ItemModel } from "./ItemModel";

export class TennisModel extends ItemModel {
  @IsString({ message: "A cor deve ser uma string." })
  private color!: string;

  @IsInt({ message: "O tamanho deve ser um número inteiro." })
  @Min(0, { message: "O tamanho não pode ser negativo." })
  private size!: number;

  constructor(
    image: string,
    name: string,
    description: string | null,
    price: number,
    amount: number,
    brand: string,
    color: string,
    size: number
  ) {
    super(image, name, description, price, amount, brand);
    this.color = color;
    this.size = size;
  }

  public getColor(): string {
    return this.color;
  }
  public setColor(color: string): void {
    this.color = color;
  }

  public getSize(): number {
    return this.size;
  }
  public setSize(size: number): void {
    this.size = size;
  }
}