import { ItemModel } from "../Models/ItemModel";
import { ClothesModel, ClothesCategory } from "../Models/ClothesModel";
import { TennisModel } from "../Models/TennisModel";
import { BallModel } from "../Models/BallModel";

export class ItemFactory {
  public static createItem(
    type: "clothes" | "tennis" | "ball",
    baseAttributes: {
      image: string;
      name: string;
      description: string | null;
      price: number;
      amount: number;
      brand: string;
    },
    specificAttributes?: any
  ): ItemModel {
    switch (type) {
      case "clothes":
        if (
          !specificAttributes?.color ||
          !specificAttributes?.size ||
          !specificAttributes?.category
        ) {
          throw new Error(
            "Missing attributes for Clothes: color, size, or category."
          );
        }
        return new ClothesModel(
          baseAttributes.image,
          baseAttributes.name,
          baseAttributes.description,
          baseAttributes.price,
          baseAttributes.amount,
          baseAttributes.brand,
          specificAttributes.color,
          specificAttributes.size,
          specificAttributes.category
        );

      case "tennis":
        if (
          !specificAttributes?.color ||
          specificAttributes?.size === undefined
        ) {
          throw new Error("Missing attributes for Tennis: color or size.");
        }
        return new TennisModel(
          baseAttributes.image,
          baseAttributes.name,
          baseAttributes.description,
          baseAttributes.price,
          baseAttributes.amount,
          baseAttributes.brand,
          specificAttributes.color,
          specificAttributes.size
        );

      case "ball":
        return new BallModel(
          baseAttributes.image,
          baseAttributes.name,
          baseAttributes.description,
          baseAttributes.price,
          baseAttributes.amount,
          baseAttributes.brand
        );

      default:
        throw new Error("Invalid item type.");
    }
  }
}
