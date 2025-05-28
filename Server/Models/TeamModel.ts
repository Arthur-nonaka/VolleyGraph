import {
  IsString,
  IsArray,
  IsOptional,
  Length,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { PlayerModel } from "./PlayerModel";

export class TeamModel {
  @IsString({
    message: "O nome deve ser válido.",
  })
  @Length(2, 100, {
    message: "O nome deve ter entre 2 e 100 caracteres.",
  })
  private name!: string;

  @IsOptional()
  private logo!: string | null;

  private players!: PlayerModel[];

  @IsString({
    message: "O endereço deve ser uma string.",
  })
  @Length(5, 200, {
    message: "O endereço deve ter entre 5 e 200 caracteres.",
  })
  private address!: string;

  constructor(
    name: string,
    logo: string | null,
    players: [],
    address: string
  ) {
    this.name = name;
    this.logo = logo;
    this.players = players;
    this.address = address;
  }

  public getName(): string {
    return this.name;
  }
  public setName(name: string): void {
    this.name = name;
  }

  public getLogo(): string | null {
    return this.logo;
  }
  public setLogo(logo: string | null): void {
    this.logo = logo;
  }

  public getPlayers(): PlayerModel[] {
    return this.players;
  }

  public setPlayers(players: []): void {
    this.players = players;
  }

  public addPlayer(player: any): void {
    this.players.push(player);
  }

  public removePlayer(id: string): boolean {
    const initialLength = this.players.length;
    this.players = this.players.filter((player) => player.getId() !== id);
    return this.players.length < initialLength;
  }

  public getAddress(): string {
    return this.address;
  }
  public setAddress(address: string): void {
    this.address = address;
  }
}
