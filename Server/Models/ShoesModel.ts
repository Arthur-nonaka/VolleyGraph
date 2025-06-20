import { ItemModel, ItemType, ItemVariation } from "./ItemModel";

export class ShoesModel extends ItemModel {
  constructor(
    image: string | null,
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[]
  ) {
    super(image, name, description, ItemType.SHOES, price, brand, variations);
  }
}
