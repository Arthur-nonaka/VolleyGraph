import { MongoClient } from "mongodb";

export class MongoDB {
  private client!: MongoClient;
  private url: string;
  private dbName: string;

  constructor(url: string, dbName: string) {
    this.url = url;
    this.dbName = dbName;
  }

  public async connect() {
    this.client = await MongoClient.connect(this.url);
  }

  public async disconnect() {
    await this.client.close();
  }

  public async getCollection(collectionName: string) {
    return this.client.db(this.dbName).collection(collectionName);
  }


}
