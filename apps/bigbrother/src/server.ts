import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(routes);

app.listen(PORT, () => {
  console.log("Big brother is watching on port:", PORT);
});
