import type { PoolClient } from "pg";
import { type File } from "@orwell/shared";

export async function insertFile(client: PoolClient, fileData: File) {
  const { id, name, fileType, filePath } = fileData;

  const query = `
    INSERT INTO files (id, name, file_type, file_path)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [id, name, fileType, filePath];

  try {
    await client.query(query, values);
  } catch (error) {
    console.error("Error executing query", (error as Error).stack);
    throw new Error("Error executing query");
  }
}
