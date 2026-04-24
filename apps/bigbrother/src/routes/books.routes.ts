import { Router } from "express";
import type { Request, Response } from "express";

const router: Router = Router();

router.get("/books", (_req: Request, res: Response) => {
  const book = {
    title: "1984",
    author: "George Orwell",
  };
  res.json({ books: [book] });
});

export default router;
