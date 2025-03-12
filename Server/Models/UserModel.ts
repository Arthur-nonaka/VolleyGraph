export class UserModel {
  private email!: string;
  private password!: string;

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
