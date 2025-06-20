import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsEnum,
  IsArray,
  ValidateNested,
  IsObject,
} from "class-validator";
import "reflect-metadata";
import { Type } from "class-transformer";

export enum ItemType {
  BALL = "ball",
  SHOES = "shoes",
  CLOTHES = "clothes",
}

export enum Gender {
  MEN = "men",
  WOMEN = "women",
  UNISEX = "unisex",
  KIDS = "kids",
}

export enum ClothingCategory {
  SHIRT = "shirt",
  PANTS = "pants",
  SHORTS = "shorts",
  JACKET = "jacket",
  ACCESSORIES = "accessories",
}

export class ItemVariation {
  @IsString({ message: "A cor deve ser uma string." })
  private color!: string;

  @IsString({ message: "O tamanho deve ser uma string." })
  private colorName!: string;

  @IsString({ message: "O tamanho deve ser uma string." })
  private size!: string;

  @IsNumber({}, { message: "A quantidade deve ser um número." })
  @Min(0, { message: "A quantidade não pode ser negativa." })
  private quantity!: number;

  constructor(
    color: string,
    colorName: string,
    size: string,
    quantity: number
  ) {
    this.color = color;
    this.colorName = colorName;
    this.size = size;
    this.quantity = quantity;
  }

  // Getters
  public getColor(): string {
    return this.color;
  }

  public getSize(): string {
    return this.size;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getColorName(): string {
    return this.colorName;
  }

  // Setters
  public setColor(color: string): void {
    this.color = color;
  }

  public setSize(size: string): void {
    this.size = size;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  public setColorName(colorName: string): void {
    this.colorName = colorName;
  }
}

export class ItemModel {
  @IsString({ message: "O nome deve ser uma string." })
  private name!: string;

  @IsString({ message: "A descrição deve ser uma string." })
  @IsOptional()
  private description!: string | null;

  @IsEnum(ItemType, { message: "Tipo de item inválido." })
  private type!: ItemType;

  @IsNumber({}, { message: "O preço deve ser um número." })
  @Min(0, { message: "O preço não pode ser negativo." })
  private price!: number;

  @IsString({ message: "A marca deve ser uma string." })
  private brand!: string;

  @IsArray({ message: "Variações devem ser um array." })
  @ValidateNested({ each: true })
  @Type(() => ItemVariation)
  private variations!: ItemVariation[];

  @IsEnum(Gender, { message: "Gênero inválido." })
  @IsOptional()
  private gender?: Gender;

  private image: string | null;

  constructor(
    image: string | null,
    name: string,
    description: string | null,
    type: ItemType,
    price: number,
    brand: string,
    variations: ItemVariation[],
    gender?: Gender
  ) {
    this.image = image;
    this.name = name;
    this.description = description;
    this.type = type;
    this.price = price;
    this.brand = brand;
    this.variations = variations;
    this.gender = gender;
  }

  // Getters
  public getImage(): string | null {
    return this.image;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getType(): ItemType {
    return this.type;
  }

  public getPrice(): number {
    return this.price;
  }

  public getBrand(): string {
    return this.brand;
  }

  public getVariations(): ItemVariation[] {
    return this.variations;
  }

  public getGender(): Gender | undefined {
    return this.gender;
  }

  // Setters
  public setImage(image: string | null): void {
    this.image = image;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setDescription(description: string | null): void {
    this.description = description;
  }

  public setType(type: ItemType): void {
    this.type = type;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public setBrand(brand: string): void {
    this.brand = brand;
  }

  public setVariations(variations: ItemVariation[]): void {
    this.variations = variations;
  }

  public setGender(gender: Gender): void {
    this.gender = gender;
  }

  // Helper methods
  public addVariation(variation: ItemVariation): void {
    this.variations.push(variation);
  }

  public removeVariation(color: string, size: string): boolean {
    const index = this.variations.findIndex(
      (v) => v.getColor() === color && v.getSize() === size
    );
    if (index > -1) {
      this.variations.splice(index, 1);
      return true;
    }
    return false;
  }

  public findVariation(color: string, size: string): ItemVariation | undefined {
    return this.variations.find(
      (v) => v.getColor() === color && v.getSize() === size
    );
  }

  public getTotalStock(): number {
    return this.variations.reduce(
      (total, variation) => total + variation.getQuantity(),
      0
    );
  }

  public getAvailableColors(): string[] {
    return [...new Set(this.variations.map((v) => v.getColor()))];
  }

  public getAvailableSizes(): string[] {
    return [...new Set(this.variations.map((v) => v.getSize()))];
  }

  public isInStock(): boolean {
    return this.getTotalStock() > 0;
  }

  public getVariationsByColor(color: string): ItemVariation[] {
    return this.variations.filter((v) => v.getColor() === color);
  }

  public getVariationsBySize(size: string): ItemVariation[] {
    return this.variations.filter((v) => v.getSize() === size);
  }
}
