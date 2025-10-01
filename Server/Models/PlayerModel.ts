import { cp } from "fs";
import {
  IsString,
  IsInt,
  IsBoolean,
  Min,
  Max,
  IsEnum,
  IsOptional,
  IsDate,
  MinDate,
  MaxDate,
  IsNumber,
  Length,
  Matches,
} from "class-validator";
import { IsDifferentFrom } from "../validators/IsDifferentFrom";

export enum Position {
  OH = "Outside Hitter",
  OPPO = "Opposite Hitter",
  S = "Setter",
  MB = "Middle Blocker",
  L = "Libero",
  SS = "Server Specialist",
  DS = "Defense Specialist",
}

export class PlayerModel {
  private id: string | null;

  @IsString({
    message: "O nome deve ser uma string.",
  })
  @Length(2, 100, {
    message: "O nome deve ter entre 2 e 100 caracteres.",
  })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, {
    message: "O nome deve conter apenas letras, espaços, apóstrofos ou hífens.",
  })
  private name!: string;

  @IsDate()
  @MinDate(new Date("1900-01-01"), {
    message: "A data deve ser posterior a 1º de janeiro de 1900.",
  })
  @MaxDate(new Date(), {
    message: "A data não pode ser no futuro.",
  })
  private age!: Date;

  @IsNumber()
  @Min(0.5)
  @Max(3.0)
  private height!: number;

  @IsEnum(Position, {
    message: "mainPosition deve ser uma posição válida do enum Position.",
  })
  private mainPosition!: Position;

  @IsEnum(Position, {
    message: "subPosition deve ser uma posição válida do enum Position.",
  })
  @IsOptional()
  @IsDifferentFrom("mainPosition", {
    message: "The positions nao pode ser a mesma",
  })
  private subPosition!: Position | null;

  // Reception Statistics (Pass Quality)
  @IsInt()
  @Min(0)
  private APass!: number; // Perfect pass (3 points)

  @IsInt()
  @Min(0)
  private BPass!: number; // Good pass (2 points)

  @IsInt()
  @Min(0)
  private CPass!: number; // Poor pass (1 point)

  @IsInt()
  @Min(0)
  private passErrors!: number; // Reception errors (0 points)

  // Setting Statistics
  @IsInt()
  @Min(0)
  private ASet!: number; // Perfect set

  @IsInt()
  @Min(0)
  private BSet!: number; // Good set

  @IsInt()
  @Min(0)
  private CSet!: number; // Poor set

  @IsInt()
  @Min(0)
  private setErrors!: number; // Setting errors

  // Attack Statistics
  @IsInt()
  @Min(0)
  private kills!: number; // Successful attacks

  @IsInt()
  @Min(0)
  private attackErrors!: number; // Attack errors

  @IsInt()
  @Min(0)
  private attackAttempts!: number; // Total attack attempts

  // Serve Statistics
  @IsInt()
  @Min(0)
  private aces!: number; // Service aces

  @IsInt()
  @Min(0)
  private serveErrors!: number; // Service errors

  @IsInt()
  @Min(0)
  private serveAttempts!: number; // Total serves

  // Block Statistics
  @IsInt()
  @Min(0)
  private soloBlocks!: number; // Solo blocks

  @IsInt()
  @Min(0)
  private assistBlocks!: number; // Block assists

  @IsInt()
  @Min(0)
  private blockErrors!: number; // Blocking errors

  // Dig Statistics
  @IsInt()
  @Min(0)
  private digs!: number; // Successful digs

  @IsInt()
  @Min(0)
  private digAttempts!: number; // Total dig attempts

  // Game Statistics
  @IsInt()
  @Min(0)
  private setsPlayed!: number;

  @IsInt()
  @Min(0)
  private matchesPlayed!: number;

  // Disciplinary Statistics
  @IsInt()
  @Min(0)
  private yellowCards!: number;

  @IsInt()
  @Min(0)
  private redCards!: number;

  @IsInt()
  @Min(0)
  private greenCards!: number;

  // Legacy fields for backward compatibility
  @IsInt()
  @Min(0)
  private points!: number;

  @IsInt()
  @Min(0)
  private blockPoints!: number;

  @IsInt()
  @Min(0)
  private servePoints!: number;

  @IsInt()
  @Min(0)
  private spikePoints!: number;

  @IsBoolean()
  private retired!: boolean;

  @IsString()
  @IsOptional()
  private imageUrl: string | null;

  constructor(
    name: string,
    age: Date,
    height: number,
    mainPosition: Position,
    subPosition: Position | null = null,
    // Reception stats
    APass: number = 0,
    BPass: number = 0,
    CPass: number = 0,
    passErrors: number = 0,
    // Setting stats
    ASet: number = 0,
    BSet: number = 0,
    CSet: number = 0,
    setErrors: number = 0,
    // Attack stats
    kills: number = 0,
    attackErrors: number = 0,
    attackAttempts: number = 0,
    // Serve stats
    aces: number = 0,
    serveErrors: number = 0,
    serveAttempts: number = 0,
    // Block stats
    soloBlocks: number = 0,
    assistBlocks: number = 0,
    blockErrors: number = 0,
    // Dig stats
    digs: number = 0,
    digAttempts: number = 0,
    // Game stats
    setsPlayed: number = 0,
    matchesPlayed: number = 0,
    // Disciplinary stats
    yellowCards: number = 0,
    redCards: number = 0,
    greenCards: number = 0,
    // Legacy fields
    points: number = 0,
    blockPoints: number = 0,
    servePoints: number = 0,
    spikePoints: number = 0,
    retired: boolean = false,
    imageUrl: string | null = null,
    id: string | null = null
  ) {
    this.name = name;
    this.age = age;
    this.height = height;
    this.mainPosition = mainPosition;
    this.subPosition = subPosition;
    this.APass = APass;
    this.BPass = BPass;
    this.CPass = CPass;
    this.passErrors = passErrors;
    this.ASet = ASet;
    this.BSet = BSet;
    this.CSet = CSet;
    this.setErrors = setErrors;
    this.kills = kills;
    this.attackErrors = attackErrors;
    this.attackAttempts = attackAttempts;
    this.aces = aces;
    this.serveErrors = serveErrors;
    this.serveAttempts = serveAttempts;
    this.soloBlocks = soloBlocks;
    this.assistBlocks = assistBlocks;
    this.blockErrors = blockErrors;
    this.digs = digs;
    this.digAttempts = digAttempts;
    this.setsPlayed = setsPlayed;
    this.matchesPlayed = matchesPlayed;
    this.yellowCards = yellowCards;
    this.redCards = redCards;
    this.greenCards = greenCards;
    this.points = points;
    this.blockPoints = blockPoints;
    this.servePoints = servePoints;
    this.spikePoints = spikePoints;
    this.retired = retired;
    this.imageUrl = imageUrl;
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }
  public setName(name: string): void {
    this.name = name;
  }

  public getAge(): Date {
    return this.age;
  }
  public setAge(age: Date): void {
    this.age = age;
  }

  public getHeight(): number {
    return this.height;
  }
  public setHeight(height: number): void {
    this.height = height;
  }

  public getMainPosition(): string {
    return this.mainPosition;
  }
  public setMainPosition(mainPosition: Position): void {
    this.mainPosition = mainPosition;
  }

  public getSubPosition(): string | null {
    return this.subPosition;
  }
  public setSubPosition(subPosition: Position): void {
    this.subPosition = subPosition;
  }

  public getAPass(): number {
    return this.APass;
  }
  public setAPass(APass: number): void {
    this.APass = APass;
  }

  public getBPass(): number {
    return this.BPass;
  }
  public setBPass(BPass: number): void {
    this.BPass = BPass;
  }

  public getCPass(): number {
    return this.CPass;
  }
  public setCPass(CPass: number): void {
    this.CPass = CPass;
  }

  public getASet(): number {
    return this.ASet;
  }
  public setASet(ASet: number): void {
    this.ASet = ASet;
  }

  public getBSet(): number {
    return this.BSet;
  }
  public setBSet(BSet: number): void {
    this.BSet = BSet;
  }

  public getCSet(): number {
    return this.CSet;
  }
  public setCSet(CSet: number): void {
    this.CSet = CSet;
  }

  public getPoints(): number {
    return this.points;
  }
  public setPoints(points: number): void {
    this.points = points;
  }

  public getBlockPoints(): number {
    return this.blockPoints;
  }
  public setBlockPoints(blockPoints: number): void {
    this.blockPoints = blockPoints;
  }

  public getServePoints(): number {
    return this.servePoints;
  }
  public setServePoints(servePoints: number): void {
    this.servePoints = servePoints;
  }

  public getSpikePoints(): number {
    return this.spikePoints;
  }
  public setSpikePoints(spikePoints: number): void {
    this.spikePoints = spikePoints;
  }

  public isRetired(): boolean {
    return this.retired;
  }
  public setRetired(retired: boolean): void {
    this.retired = retired;
  }

  public getImageUrl(): string | null {
    return this.imageUrl;
  }
  public setImageUrl(imageUrl: string): void {
    this.imageUrl = imageUrl;
  }

  public getId(): string | null {
    return this.id;
  }

  public setId(id: string | null): void {
    this.id = id;
  }

  // Getters and Setters for new statistical fields

  public getPassErrors(): number {
    return this.passErrors;
  }
  public setPassErrors(passErrors: number): void {
    this.passErrors = passErrors;
  }

  public getSetErrors(): number {
    return this.setErrors;
  }
  public setSetErrors(setErrors: number): void {
    this.setErrors = setErrors;
  }

  public getKills(): number {
    return this.kills;
  }
  public setKills(kills: number): void {
    this.kills = kills;
  }

  public getAttackErrors(): number {
    return this.attackErrors;
  }
  public setAttackErrors(attackErrors: number): void {
    this.attackErrors = attackErrors;
  }

  public getAttackAttempts(): number {
    return this.attackAttempts;
  }
  public setAttackAttempts(attackAttempts: number): void {
    this.attackAttempts = attackAttempts;
  }

  public getAces(): number {
    return this.aces;
  }
  public setAces(aces: number): void {
    this.aces = aces;
  }

  public getServeErrors(): number {
    return this.serveErrors;
  }
  public setServeErrors(serveErrors: number): void {
    this.serveErrors = serveErrors;
  }

  public getServeAttempts(): number {
    return this.serveAttempts;
  }
  public setServeAttempts(serveAttempts: number): void {
    this.serveAttempts = serveAttempts;
  }

  public getSoloBlocks(): number {
    return this.soloBlocks;
  }
  public setSoloBlocks(soloBlocks: number): void {
    this.soloBlocks = soloBlocks;
  }

  public getAssistBlocks(): number {
    return this.assistBlocks;
  }
  public setAssistBlocks(assistBlocks: number): void {
    this.assistBlocks = assistBlocks;
  }

  public getBlockErrors(): number {
    return this.blockErrors;
  }
  public setBlockErrors(blockErrors: number): void {
    this.blockErrors = blockErrors;
  }

  public getDigs(): number {
    return this.digs;
  }
  public setDigs(digs: number): void {
    this.digs = digs;
  }

  public getDigAttempts(): number {
    return this.digAttempts;
  }
  public setDigAttempts(digAttempts: number): void {
    this.digAttempts = digAttempts;
  }

  public getSetsPlayed(): number {
    return this.setsPlayed;
  }
  public setSetsPlayed(setsPlayed: number): void {
    this.setsPlayed = setsPlayed;
  }

  public getMatchesPlayed(): number {
    return this.matchesPlayed;
  }
  public setMatchesPlayed(matchesPlayed: number): void {
    this.matchesPlayed = matchesPlayed;
  }

  public getYellowCards(): number {
    return this.yellowCards;
  }
  public setYellowCards(yellowCards: number): void {
    this.yellowCards = yellowCards;
  }

  public getRedCards(): number {
    return this.redCards;
  }
  public setRedCards(redCards: number): void {
    this.redCards = redCards;
  }

  public getGreenCards(): number {
    return this.greenCards;
  }
  public setGreenCards(greenCards: number): void {
    this.greenCards = greenCards;
  }

  // Advanced Statistical Methods Based on Data Science

  /**
   * Disciplinary Score - Behavior and conduct analysis
   * Formula: (Green Cards * 2 - Yellow Cards - Red Cards * 3) / Matches Played
   * Higher score indicates better conduct
   */
  public getDisciplinaryScore(): number {
    if (this.matchesPlayed === 0) return 0;
    return (
      (this.greenCards * 2 - this.yellowCards - this.redCards * 3) /
      this.matchesPlayed
    );
  }

  /**
   * Cards per Match - Disciplinary frequency indicator
   */
  public getCardsPerMatch(): number {
    if (this.matchesPlayed === 0) return 0;
    return (this.yellowCards + this.redCards) / this.matchesPlayed;
  }

  /**
   * Conduct Rating - Professional behavior assessment (0-100 scale)
   */
  public getConductRating(): number {
    if (this.matchesPlayed === 0) return 100; // Benefit of doubt for new players

    const totalNegativeCards = this.yellowCards + this.redCards * 2;
    const totalPositiveCards = this.greenCards;

    // Base score starts at 100, deductions for bad conduct, bonuses for good conduct
    const baseScore = 100;
    const penaltyPerCard = 5; // 5 points deduction per negative card
    const bonusPerGreenCard = 2; // 2 points bonus per green card

    const penalties = totalNegativeCards * penaltyPerCard;
    const bonuses = totalPositiveCards * bonusPerGreenCard;

    return Math.max(0, Math.min(100, baseScore - penalties + bonuses));
  }

  /**
   * Reception Efficiency - Industry standard volleyball metric
   * Formula: (A-pass*3 + B-pass*2 + C-pass*1) / Total reception attempts
   * Returns value between 0-3, where 3 is perfect
   */
  public getReceptionEfficiency(): number {
    const totalAttempts =
      this.APass + this.BPass + this.CPass + this.passErrors;
    if (totalAttempts === 0) return 0;
    return (this.APass * 3 + this.BPass * 2 + this.CPass * 1) / totalAttempts;
  }

  /**
   * Attack Efficiency (Kill %) - Key performance indicator
   * Formula: (Kills - Errors) / Total Attacks
   */
  public getAttackEfficiency(): number {
    if (this.attackAttempts === 0) return 0;
    return (this.kills - this.attackErrors) / this.attackAttempts;
  }

  /**
   * Kill Percentage - Success rate of attacks
   */
  public getKillPercentage(): number {
    if (this.attackAttempts === 0) return 0;
    return this.kills / this.attackAttempts;
  }

  /**
   * Serve Efficiency - Ace to error ratio with attempts normalization
   */
  public getServeEfficiency(): number {
    if (this.serveAttempts === 0) return 0;
    return (this.aces - this.serveErrors) / this.serveAttempts;
  }

  /**
   * Ace Percentage - Service ace success rate
   */
  public getAcePercentage(): number {
    if (this.serveAttempts === 0) return 0;
    return this.aces / this.serveAttempts;
  }

  /**
   * Block Efficiency - Total blocks per set
   */
  public getBlocksPerSet(): number {
    if (this.setsPlayed === 0) return 0;
    return (this.soloBlocks + this.assistBlocks) / this.setsPlayed;
  }

  /**
   * Dig Efficiency - Successful digs percentage
   */
  public getDigEfficiency(): number {
    if (this.digAttempts === 0) return 0;
    return this.digs / this.digAttempts;
  }

  /**
   * Overall Performance Index - Weighted composite score
   * Uses position-based weights for different skills
   */
  public getPerformanceIndex(): number {
    const weights = this.getPositionWeights();

    const receptionScore = this.getReceptionEfficiency() / 3; // Normalize to 0-1
    const attackScore = Math.max(0, this.getAttackEfficiency() + 0.5); // Shift range to positive
    const serveScore = Math.max(0, this.getServeEfficiency() + 0.5);
    const blockScore = Math.min(1, this.getBlocksPerSet() / 2); // Normalize blocks
    const digScore = this.getDigEfficiency();

    return (
      (receptionScore * weights.reception +
        attackScore * weights.attack +
        serveScore * weights.serve +
        blockScore * weights.block +
        digScore * weights.dig) *
      100
    );
  }

  /**
   * Position-specific weight distribution for performance calculation
   */
  private getPositionWeights(): {
    reception: number;
    attack: number;
    serve: number;
    block: number;
    dig: number;
  } {
    switch (this.mainPosition) {
      case Position.OH: // Outside Hitter
        return {
          reception: 0.25,
          attack: 0.35,
          serve: 0.15,
          block: 0.15,
          dig: 0.1,
        };
      case Position.OPPO: // Opposite
        return {
          reception: 0.1,
          attack: 0.4,
          serve: 0.2,
          block: 0.2,
          dig: 0.1,
        };
      case Position.S: // Setter
        return {
          reception: 0.15,
          attack: 0.1,
          serve: 0.25,
          block: 0.15,
          dig: 0.35,
        };
      case Position.MB: // Middle Blocker
        return {
          reception: 0.05,
          attack: 0.3,
          serve: 0.15,
          block: 0.4,
          dig: 0.1,
        };
      case Position.L: // Libero
        return {
          reception: 0.4,
          attack: 0.0,
          serve: 0.0,
          block: 0.0,
          dig: 0.6,
        };
      case Position.DS: // Defensive Specialist
        return {
          reception: 0.35,
          attack: 0.05,
          serve: 0.1,
          block: 0.05,
          dig: 0.45,
        };
      default:
        return {
          reception: 0.2,
          attack: 0.25,
          serve: 0.2,
          block: 0.2,
          dig: 0.15,
        };
    }
  }

  /**
   * Get player efficiency trends (requires historical data)
   * Returns consistency score based on performance variance
   */
  public getConsistencyScore(): number {
    // This would require match-by-match data to calculate variance
    // For now, return a simplified consistency based on error rates
    const totalAttempts =
      this.attackAttempts + this.serveAttempts + this.digAttempts;
    const totalErrors = this.attackErrors + this.serveErrors + this.blockErrors;

    if (totalAttempts === 0) return 0;
    return Math.max(0, 1 - totalErrors / totalAttempts) * 100;
  }

  /**
   * Position versatility score based on skill distribution
   */
  public getVersatilityScore(): number {
    const skills = [
      this.getReceptionEfficiency(),
      this.getAttackEfficiency() + 0.5, // Normalize to positive
      this.getServeEfficiency() + 0.5,
      this.getBlocksPerSet() / 2,
      this.getDigEfficiency(),
    ];

    // Calculate coefficient of variation (lower = more versatile)
    const mean = skills.reduce((a, b) => a + b) / skills.length;
    const variance =
      skills.reduce((sum, skill) => sum + Math.pow(skill - mean, 2), 0) /
      skills.length;
    const standardDev = Math.sqrt(variance);

    const coefficientOfVariation = mean > 0 ? standardDev / mean : 1;
    return Math.max(0, (1 - coefficientOfVariation) * 100);
  }

  /**
   * Get all advanced statistics as an object
   */
  public getAdvancedStats(): {
    receptionEfficiency: number;
    attackEfficiency: number;
    killPercentage: number;
    serveEfficiency: number;
    acePercentage: number;
    blocksPerSet: number;
    digEfficiency: number;
    performanceIndex: number;
    consistencyScore: number;
    versatilityScore: number;
    disciplinaryScore: number;
    cardsPerMatch: number;
    conductRating: number;
  } {
    return {
      receptionEfficiency: this.getReceptionEfficiency(),
      attackEfficiency: this.getAttackEfficiency(),
      killPercentage: this.getKillPercentage(),
      serveEfficiency: this.getServeEfficiency(),
      acePercentage: this.getAcePercentage(),
      blocksPerSet: this.getBlocksPerSet(),
      digEfficiency: this.getDigEfficiency(),
      performanceIndex: this.getPerformanceIndex(),
      consistencyScore: this.getConsistencyScore(),
      versatilityScore: this.getVersatilityScore(),
      disciplinaryScore: this.getDisciplinaryScore(),
      cardsPerMatch: this.getCardsPerMatch(),
      conductRating: this.getConductRating(),
    };
  }
}
