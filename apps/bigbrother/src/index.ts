import express from "express";
import type { Request, Response } from "express";

const PORT = 3000;

const app = express();

// Endpoint to list all books
app.get("/books", (req: Request, res: Response) => {
  const book = {
    title: "1984",
    author: "George Orwell",
  };
  res.json({ books: [book] });
});

app.listen(PORT, () => {
  console.log("Big brother is watching on port:", PORT);
});
