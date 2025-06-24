import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CupomModel {
  @IsString({ message: "O código do cupom deve ser uma string." })
  private name: string;

  @IsNumber({}, { message: "O desconto do cupom deve ser um número." })
  private discount: number;

  @IsDate({ message: "A data de expiração deve ser uma data válida." })
  @IsOptional()
  private expirationDate?: Date | null;

  constructor(name: string, discount: number, expirationDate?: Date | null) {
    this.name = name;
    this.discount = discount;
    this.expirationDate = expirationDate ?? null;
  }

  public getName(): string {
    return this.name;
  }
  public setName(name: string): void {
    this.name = name;
  }
  public getDiscount(): number {
    return this.discount;
  }
  public setDiscount(discount: number): void {
    this.discount = discount;
  }
  public getExpirationDate(): Date | null | undefined {
    return this.expirationDate;
  }
  public setExpirationDate(expirationDate: Date | null): void {
    this.expirationDate = expirationDate;
  }
  public isValid(): boolean {
    const currentDate = new Date();
    if (this.expirationDate) {
      return this.expirationDate >= currentDate;
    }
    return true;
  }
}
