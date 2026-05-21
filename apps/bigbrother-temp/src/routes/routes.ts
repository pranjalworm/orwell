import { Router } from "express";
import booksRoutes from "./books.routes.js";

const router = Router();

router.use(booksRoutes);

export default Router().use("/api", router) as Router;
