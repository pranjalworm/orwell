import type { PoolClient } from "pg";
import type { UUID } from "crypto";

export async function insertBookFile(
  client: PoolClient,
  bookId: UUID,
  fileId: UUID,
) {
  const query = `
    INSERT INTO book_files (book_id, file_id)
    VALUES ($1, $2)
  `;
  const values = [bookId, fileId];

  try {
    await client.query(query, values);
  } catch (error) {
    console.error("Error executing query", (error as Error).stack);
    throw new Error("Error executing query");
  }
}
