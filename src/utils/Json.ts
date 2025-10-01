export class Json {
  protected data: any[];

  constructor(data: any[]) {
    this.data = data;
  }

  protected getJsonData(): any[] {
    return this.data;
  }

  public getJson(): string {
    return JSON.stringify(this.data);
  }

  public export(filename: string): void {
    this.downloadFile(this.getJson(), filename, "json", "application/json");
  }

  public downloadFile(
    content: string,
    filename: string,
    extension: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.${extension}`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
