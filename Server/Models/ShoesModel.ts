import { ItemModel, ItemType, ItemVariation } from "./ItemModel";

export class ShoesModel extends ItemModel {
  constructor(
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[]
  ) {
    super(name, description, ItemType.SHOES, price, brand, variations);
  }
}
