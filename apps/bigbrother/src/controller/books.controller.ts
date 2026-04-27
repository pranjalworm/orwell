import fs from "fs";
import path from "path";
import type { Request, Response } from "express";

export async function getBooks(_req: Request, res: Response) {
  const booksDirPath = path.resolve(process.env.BOOKS_PATH as string);

  const data = await fs.promises.readdir(booksDirPath);

  return res.status(200).json({ books: data });
}
