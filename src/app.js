import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import { router as vistasRouter } from "./routes/vistas.router.js";
import { middleware01, middleware02 } from "./middleware/generales.js";
import { errotHandler } from "./middleware/errorHandler.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
/* app.use(express.static("./src/public")); */
/* app.use(middleware01); */

app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", vistasRouter);
/* app.use(errotHandler); */

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
