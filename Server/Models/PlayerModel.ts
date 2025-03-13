import { cp } from "fs";
import { IsString, IsInt, IsBoolean, Min, Max, IsEnum, IsAlpha } from 'class-validator';
import { IsDifferentFrom } from '../validators/IsDifferentFrom';

export enum Position {
    OH = "Outside Hitter",
    OPPO = "Opposite Hitter",
    S = "Setter",
    MB = "Middle Blocker",
    L = "Libero",
    SS = "Server Specialist",
    DS = "Defense Specialist"
}

export class PlayerModel {
    @IsAlpha()

    @IsString()
    private name!: string;

    @IsInt()
    @Min(10)
    @Max(80)
    private age!: Date;

    @IsInt()
    @Min(100)
    @Max(250)
    private height!: number;

    @IsEnum(Position, { message: 'mainPosition deve ser uma posição válida do enum Position.' })
    private mainPosition!: Position;

    @IsEnum(Position, { message: 'subPosition deve ser uma posição válida do enum Position.' })
    @IsDifferentFrom('mainPosition', {
      message: 'The positions cannot be the same',
    })
    private subPosition!: Position;

    @IsInt()
    @Min(0)
    private APass!: number;

    @IsInt()
    @Min(0)
    private BPass!: number;

    @IsInt()
    @Min(0)
    private CPass!: number;

    @IsInt()
    @Min(0)
    private ASet!: number;

    @IsInt()
    @Min(0)
    private BSet!: number;

    @IsInt()
    @Min(0)
    private CSet!: number;

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
  
    constructor(name:string, age:Date, height:number, mainPosition:Position, subPosition:Position, APass:number, BPass:number, CPass:number, ASet:number,
                BSet:number, CSet:number, points:number, blockPoints:number, servePoints:number, spikePoints:number, retired:boolean)
    {
      this.name = name;
      this.age = age;
      this.height = height;
      this.mainPosition = mainPosition;
      this.subPosition = subPosition;
      this.APass = APass;
      this.BPass = BPass;
      this.CPass = CPass;
      this.ASet = ASet;
      this.BSet = BSet;
      this.CSet = CSet;
      this.points = points;
      this.blockPoints = blockPoints;
      this.servePoints = servePoints;
      this.spikePoints = spikePoints;
      this.retired = retired;
    }
  
    public getName(): string { return this.name; }
    public setName(name: string): void { this.name = name; }

    public getAge(): Date { return this.age; }
    public setAge(age: Date): void { this.age = age; }

    public getHeight(): number { return this.height; }
    public setHeight(height: number): void { this.height = height; }

    public getMainPosition(): string { return this.mainPosition; }
    public setMainPosition(mainPosition: Position): void { this.mainPosition = mainPosition; }

    public getSubPosition(): string { return this.subPosition; }
    public setSubPosition(subPosition: Position): void { this.subPosition = subPosition; }

    public getAPass(): number { return this.APass; }
    public setAPass(APass: number): void { this.APass = APass; }

    public getBPass(): number { return this.BPass; }
    public setBPass(BPass: number): void { this.BPass = BPass; }

    public getCPass(): number { return this.CPass; }
    public setCPass(CPass: number): void { this.CPass = CPass; }

    public getASet(): number { return this.ASet; }
    public setASet(ASet: number): void { this.ASet = ASet; }

    public getBSet(): number { return this.BSet; }
    public setBSet(BSet: number): void { this.BSet = BSet; }

    public getCSet(): number { return this.CSet; }
    public setCSet(CSet: number): void { this.CSet = CSet; }

    public getPoints(): number { return this.points; }
    public setPoints(points: number): void { this.points = points; }

    public getBlockPoints(): number { return this.blockPoints; }
    public setBlockPoints(blockPoints: number): void { this.blockPoints = blockPoints; }

    public getServePoints(): number { return this.servePoints; }
    public setServePoints(servePoints: number): void { this.servePoints = servePoints; }

    public getSpikePoints(): number { return this.spikePoints; }
    public setSpikePoints(spikePoints: number): void { this.spikePoints = spikePoints; }

    public isRetired(): boolean { return this.retired; }
    public setRetired(retired: boolean): void { this.retired = retired; }
  }
  