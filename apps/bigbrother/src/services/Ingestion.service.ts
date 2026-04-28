import { type Book } from "@orwell/shared";
import { insertBook } from "../db/books.db.js";
import { insertFile } from "../db/files.db.js";
import { pool } from "../db/pool.js";
import { insertBookFile } from "../db/book_files.db.js";

export async function ingestBook(
  bookData: Omit<Book, "id" | "dateAdded" | "file">,
  file: Express.Multer.File,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // mark entry in the books table
    const bookId = crypto.randomUUID();
    await insertBook(client, bookData, bookId);

    // mark entry in the file table
    const fileId = crypto.randomUUID();
    const fileType = file.filename.split(".").at(-1) ?? "";
    const fileData = {
      id: fileId,
      name: file.filename,
      fileType,
      filePath: file.path,
    };
    await insertFile(client, fileData);

    // mark entry in the book_files table
    await insertBookFile(client, bookId, fileId);

    await client.query("COMMIT");
    console.log("Transaction completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.warn("Transaction failed, rolled back", (err as Error).stack);
    throw new Error("Book upload failed");
  } finally {
    client.release();
  }
}
