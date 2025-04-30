import { IsString, IsNumber, IsOptional, Min, IsUrl } from "class-validator";

export class ItemModel {
  @IsUrl({}, { message: "A imagem deve ser uma URL válida." })
  private image!: string;

  @IsString({ message: "O nome deve ser uma string." })
  private name!: string;

  @IsString({ message: "A descrição deve ser uma string." })
  @IsOptional()
  private description!: string | null;

  @IsNumber({}, { message: "O preço deve ser um número." })
  @Min(0, { message: "O preço não pode ser negativo." })
  private price!: number;

  @IsNumber({}, { message: "A quantidade deve ser um número." })
  @Min(0, { message: "A quantidade não pode ser negativa." })
  private amount!: number;

  @IsString({ message: "A marca deve ser uma string." })
  private brand!: string;

  constructor(
    image: string,
    name: string,
    description: string | null,
    price: number,
    amount: number,
    brand: string
  ) {
    this.image = image;
    this.name = name;
    this.description = description;
    this.price = price;
    this.amount = amount;
    this.brand = brand;
  }

  // Getters and Setters
  public getImage(): string {
    return this.image;
  }
  public setImage(image: string): void {
    this.image = image;
  }

  public getName(): string {
    return this.name;
  }
  public setName(name: string): void {
    this.name = name;
  }

  public getDescription(): string | null {
    return this.description;
  }
  public setDescription(description: string | null): void {
    this.description = description;
  }

  public getPrice(): number {
    return this.price;
  }
  public setPrice(price: number): void {
    this.price = price;
  }

  public getAmount(): number {
    return this.amount;
  }
  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public getBrand(): string {
    return this.brand;
  }
  public setBrand(brand: string): void {
    this.brand = brand;
  }
}