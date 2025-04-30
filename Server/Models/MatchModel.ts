import {
  IsString,
  IsDate,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { TeamModel } from "./TeamModel";

export class MatchModel {
  @ValidateNested()
  @Type(() => TeamModel)
  private homeTeam!: TeamModel;

  @ValidateNested()
  @Type(() => TeamModel)
  private awayTeam!: TeamModel;

  @IsDate({
    message: "A data deve ser uma data válida.",
  })
  private date!: Date;

  @IsString({
    message: "A localização deve ser uma string.",
  })
  private location!: string;

  @IsInt({
    message: "O placar do time da casa deve ser um número inteiro.",
  })
  @Min(0, {
    message: "O placar do time da casa não pode ser negativo.",
  })
  private homeTeamScore!: number;

  @IsInt({
    message: "O placar do time visitante deve ser um número inteiro.",
  })
  @Min(0, {
    message: "O placar do time visitante não pode ser negativo.",
  })
  private awayTeamScore!: number;

  constructor(
    homeTeam: TeamModel,
    awayTeam: TeamModel,
    date: Date,
    location: string,
    homeScore: number = 0,
    awayScore: number = 0
  ) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.date = date;
    this.location = location;
    this.homeTeamScore = homeScore;
    this.awayTeamScore = awayScore;
  }

  public getHomeTeam(): TeamModel {
    return this.homeTeam;
  }
  public setHomeTeam(homeTeam: TeamModel): void {
    this.homeTeam = homeTeam;
  }

  public getAwayTeam(): TeamModel {
    return this.awayTeam;
  }
  public setAwayTeam(awayTeam: TeamModel): void {
    this.awayTeam = awayTeam;
  }

  public getDate(): Date {
    return this.date;
  }
  public setDate(date: Date): void {
    this.date = date;
  }

  public getLocation(): string {
    return this.location;
  }
  public setLocation(location: string): void {
    this.location = location;
  }

  public getHomeTeamScore(): number {
    return this.homeTeamScore;
  }
  public setHomeTeamScore(score: number): void {
    this.homeTeamScore = score;
  }

  public getAwayTeamScore(): number {
    return this.awayTeamScore;
  }
  public setAwayTeamScore(score: number): void {
    this.awayTeamScore = score;
  }
}
