import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function readLocalData<T>(fileName: string, defaultValue: T): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return defaultValue;
  }
}

export async function writeLocalData<T>(fileName: string, data: T): Promise<void> {
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, fileName);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to write local data ${fileName}:`, err);
  }
}
