import { BallModel } from "../Models/BallModel";
import { ClothesModel } from "../Models/ClothesModel";
import {
  ClothingCategory,
  Gender,
  ItemModel,
  ItemType,
  ItemVariation,
} from "../Models/ItemModel";
import { ShoesModel } from "../Models/ShoesModel";

export class ItemFactory {
  static createBall(
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[],
    sport?: string,
    weight?: number
  ): BallModel {
    return new BallModel(
      name,
      description,
      price,
      brand,
      variations,
      sport,
      weight
    );
  }

  static createShoes(
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[]
  ): ShoesModel {
    return new ShoesModel(name, description, price, brand, variations);
  }

  static createClothes(
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[],
    gender: Gender,
    category: ClothingCategory,
    material?: string
  ): ClothesModel {
    return new ClothesModel(
      name,
      description,
      price,
      brand,
      variations,
      gender,
      category,
      material
    );
  }

  static createItem(type: ItemType, data: any): ItemModel {
    switch (type) {
      case ItemType.BALL:
        return this.createBall(
          data.name,
          data.description,
          data.price,
          data.brand,
          data.variations,
          data.sport,
          data.weight
        );
      case ItemType.SHOES:
        return this.createShoes(
          data.name,
          data.description,
          data.price,
          data.brand,
          data.variations
        );
      case ItemType.CLOTHES:
        return this.createClothes(
          data.name,
          data.description,
          data.price,
          data.brand,
          data.variations,
          data.gender,
          data.material
        );
      default:
        throw new Error(`Tipo de item não suportado: ${type}`);
    }
  }
}
