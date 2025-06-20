import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ItemModel, ItemType, ItemVariation } from "./ItemModel";

export class BallModel extends ItemModel {
  @IsString({ message: "O esporte deve ser uma string." })
  @IsOptional()
  private sport?: string;

  @IsNumber({}, { message: "O peso deve ser um número." })
  @Min(0, { message: "O peso não pode ser negativo." })
  @IsOptional()
  private weight?: number;

  constructor(
    image: string | null,
    name: string,
    description: string | null,
    price: number,
    brand: string,
    variations: ItemVariation[],
    sport?: string,
    weight?: number
  ) {
    super(image, name, description, ItemType.BALL, price, brand, variations);
    this.sport = sport;
    this.weight = weight;
  }

  public getSport(): string | undefined {
    return this.sport;
  }

  public setSport(sport: string): void {
    this.sport = sport;
  }

  public getWeight(): number | undefined {
    return this.weight;
  }

  public setWeight(weight: number): void {
    this.weight = weight;
  }
}