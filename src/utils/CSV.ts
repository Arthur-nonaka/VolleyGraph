import { Json } from "./Json";

export class CSVAdapter extends Json {
  private CSV: string;

  constructor(data: any[]) {
    super(data);
    this.CSV = this.convertToCSV();
  }

  private convertToCSV(): string {
    const jsonData = this.getJsonData();

    if (!jsonData || jsonData.length === 0) {
      return "";
    }

    const headers = Object.keys(jsonData[0]);

    const csvRows = [
      headers.join(","),
      ...jsonData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (
              typeof value === "string" &&
              (value.includes(",") ||
                value.includes('"') ||
                value.includes("\n"))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(",")
      ),
    ];

    return csvRows.join("\n");
  }

  public getCSV(): string {
    return this.CSV;
  }

  public export(filename: string): void {
    this.downloadFile(this.CSV, filename, "csv", "text/csv;charset=utf-8;");
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
