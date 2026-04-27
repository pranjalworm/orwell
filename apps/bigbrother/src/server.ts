import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import "dotenv/config";

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(routes);

app.listen(PORT, () => {
  console.log("Big brother is watching on port:", PORT);
});
