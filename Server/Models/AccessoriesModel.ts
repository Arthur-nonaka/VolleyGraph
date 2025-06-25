import { ItemModel, ItemType, ItemVariation } from "./ItemModel";

export class AccessoriesModel extends ItemModel {
  constructor(
    image: string | null,
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[],
  ) {
    super(image, name, description, ItemType.ACCESSORIES, price, brand, variations);
  }
}
