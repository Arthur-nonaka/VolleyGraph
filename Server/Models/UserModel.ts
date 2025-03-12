import { IsEmail, Length } from "class-validator";

export class UserModel {
  @IsEmail({}, { message: "Email inválido" })
  private email: string;

  @Length(6, 200, { message: "Senha deve ter mais de 6 caracteres" })
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
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
}
