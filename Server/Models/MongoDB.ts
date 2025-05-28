import { MongoClient, Collection, Document } from "mongodb";

export class MongoDB {
  private static instance: MongoDB;
  private client: MongoClient | null = null;
  private url: string;
  private dbName: string;

  private constructor() {
    this.url = "mongodb://127.0.0.1:27017/";
    this.dbName = "VolleyGraph";
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async connect(): Promise<void> {
    if (!this.client) {
      try {
        this.client = new MongoClient(this.url);
        await this.client.connect();
        console.log("Conectado ao MongoDB");
      } catch (error) {
        console.error("Falha ao conectar ao MongoDB", error);
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log("Desconectado do MongoDB");
    }
  }

  public getCollection<T extends Document = Document>(collectionName: string): Collection<T> {
    if (!this.client) {
      throw new Error("MongoClient não está conectado");
    }
    return this.client.db(this.dbName).collection<T>(collectionName);
  }
}