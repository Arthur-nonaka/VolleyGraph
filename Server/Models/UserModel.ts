import { IsEmail, Length } from "class-validator";

export class UserModel {
  @IsEmail({}, { message: "Email inválido" })
  private email: string;

  @Length(6, 200, { message: "Senha deve ter mais de 6 caracteres" })
  private password: string;

  private address: string;

  constructor(email: string, password: string, address: string) {
    this.email = email;
    this.password = password;
    this.address = address;
  }

  public getEmail() {
    return this.email;
  }

  public getPassword() {
    return this.password;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public getAddress() {
    return this.address;
  }

  public setAddress(address: string) {
    this.address = address;
  }
}
