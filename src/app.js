import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import { router as viewsRouter } from "./routes/views.router.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public/"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export const io = new Server(server);
