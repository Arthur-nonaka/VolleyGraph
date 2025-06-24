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
  private expirationDate?: Date;

  constructor(name: string, discount: number, expirationDate?: Date) {
    this.name = name;
    this.discount = discount;
    this.expirationDate = expirationDate;
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
  public getExpirationDate(): Date | undefined {
    return this.expirationDate;
  }
  public setExpirationDate(expirationDate: Date): void {
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
