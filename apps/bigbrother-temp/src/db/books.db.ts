import type { PoolClient } from "pg";
import { type Book } from "@orwell/shared";
import type { UUID } from "crypto";

export async function insertBook(
  client: PoolClient,
  bookData: Omit<Book, "id" | "dateAdded" | "file">,
  id: UUID,
) {
  const {
    title,
    author = null,
    yearPublished = null,
    coverImageUrl = null,
  } = bookData;

  const query = `
    INSERT INTO books (id, title, author, year_published, cover_image_url)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    id,
    title?.toLowerCase(),
    author?.toLowerCase(),
    yearPublished,
    coverImageUrl,
  ];

  try {
    await client.query(query, values);
  } catch (error: unknown) {
    console.error("Error executing query", (error as Error).stack);
    throw new Error("Error executing query");
  }
}
