import { Router } from "express";
import type { Request, Response } from "express";
import { getBooks } from "../controller/books.controller.js";

const router: Router = Router();

router.get("/books", async (req: Request, res: Response) => {
  return await getBooks(req, res);
});

export default router;
