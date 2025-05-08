import { ItemModel } from "./ItemModel";

export class BallModel extends ItemModel {
  constructor(
    image: string | null,
    name: string,
    description: string | null,
    price: number,
    amount: number,
    brand: string
  ) {
    super(image, name, description, price, amount, brand);
  }
}
