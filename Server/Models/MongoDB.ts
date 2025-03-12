import { MongoClient } from "mongodb";

export class MongoDB {
  private client!: MongoClient;
  private url: string;
  private dbName: string;

  constructor() {
    this.url = "mongodb://127.0.0.1:27017/";
    this.dbName = "VolleyGraph";
  }

  public async connect() {
    try {
      this.client = await MongoClient.connect(this.url);
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    }
  }

  public async disconnect() {
    await this.client.close();
  }

  public async getCollection(collectionName: string) {
    if (!this.client) {
      throw new Error("MongoClient is not connected");
    }
    return this.client.db(this.dbName).collection(collectionName);
  }
}
