import { Router } from "express";
import type { Request, Response } from "express";
import {
  getBooks,
  uploadBook,
  multerUpload,
} from "../controller/books.controller.js";

const router: Router = Router();

router.get("/books", async (req: Request, res: Response) => {
  return await getBooks(req, res);
});

router.post(
  "/book",
  multerUpload.single("file"),
  async (req: Request, res: Response) => {
    return await uploadBook(req, res);
  },
);

export default router;
