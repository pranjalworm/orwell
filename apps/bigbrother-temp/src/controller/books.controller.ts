import fs from "fs";
import path from "path";
import multer from "multer";
import type { Request, Response } from "express";
import type { Book } from "@orwell/shared";
import { ingestBook } from "../services/Ingestion.service.js";

const uploadsPath = path.resolve(process.env.BOOKS_PATH as string);

const storage = multer.diskStorage({
  destination: uploadsPath,
  filename: (_req, file, cb) => cb(null, file.originalname),
});

export const multerUpload = multer({ storage });

export async function getBooks(_req: Request, res: Response) {
  const booksDirPath = path.resolve(process.env.BOOKS_PATH as string);

  const data = await fs.promises.readdir(booksDirPath);

  return res.status(200).json({ books: data });
}

export async function uploadBook(req: Request, res: Response) {
  const bookData: Omit<Book, "id" | "dateAdded" | "file"> = req.body;
  const file = req.file;

  try {
    await ingestBook(bookData, file as Express.Multer.File);
    res.status(201).json({ message: "Book uploaded successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Some error occured in ingesting the uploaded book" });
  }
}
