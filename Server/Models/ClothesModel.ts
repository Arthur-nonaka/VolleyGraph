import { IsString, IsEnum } from "class-validator";
import { ItemModel } from "./ItemModel";

export enum ClothesCategory {
  SHIRT = "Shirt",
  PANTS = "Pants",
  SOCKS = "Socks",
  ACCESSORIES = "Accessories",
}

export class ClothesModel extends ItemModel {
  @IsString({ message: "A cor deve ser uma string." })
  private color!: string;

  @IsString({ message: "O tamanho deve ser uma string." })
  private size!: string;

  @IsEnum(ClothesCategory, { message: "A categoria deve ser válida." })
  private category!: ClothesCategory;

  constructor(
    image: string | null,
    name: string,
    description: string | null,
    price: number,
    amount: number,
    brand: string,
    color: string,
    size: string,
    category: ClothesCategory
  ) {
    super(image, name, description, price, amount, brand);
    this.color = color;
    this.size = size;
    this.category = category;
  }

  public getColor(): string {
    return this.color;
  }
  public setColor(color: string): void {
    this.color = color;
  }

  public getSize(): string {
    return this.size;
  }
  public setSize(size: string): void {
    this.size = size;
  }

  public getCategory(): ClothesCategory {
    return this.category;
  }
  public setCategory(category: ClothesCategory): void {
    this.category = category;
  }
}