import { IsOptional, IsString } from "class-validator";
import { ClothingCategory, Gender, ItemModel, ItemType, ItemVariation } from "./ItemModel";

export class ShoesModel extends ItemModel {
  constructor(
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[],
  ) {
    super(name, description, ItemType.SHOES, price, brand, variations);
  }
}

export class ClothesModel extends ItemModel {
  @IsString({ message: "O material deve ser uma string." })
  @IsOptional()
  private material?: string;

  @IsString({ message: "A categoria deve ser uma string." })
  @IsOptional()
  private category?: ClothingCategory;

  constructor(
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[],
    gender: Gender,
    category: ClothingCategory,
    material?: string,
  ) {
    super(name, description, ItemType.CLOTHES, price, brand, variations, gender);
    this.material = material;
    this.category = category;
  }

  public getMaterial(): string | undefined {
    return this.material;
  }

  public setMaterial(material: string): void {
    this.material = material;
  }

  public setCategory(category: ClothingCategory): void {
    this.category = category;
  }

  public getCategory(): ClothingCategory | undefined {
    return this.category;
  }
  public getGender(): Gender {
    return super.getGender()!;
  }
}