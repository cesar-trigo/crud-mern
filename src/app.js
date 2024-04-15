import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import { router as vistasRouter } from "./routes/vistas.router.js";
import { middleware01, middleware02 } from "./middleware/generales.js";
import { errotHandler } from "./middleware/errorHandler.js";

const PORT = 8080;
const app = express();
let serverSocket;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views"); */
app.use(express.static("./src/public"));
/* app.use(middleware01); */

app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", vistasRouter);
/* app.use(errotHandler); */

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/* const io = new Server(server); */
serverSocket = new Server(server);
serverSocket.on("connection", socket => {
  console.log(`se conecto un cliente ${socket.id}`);

  socket.emit("saludo", "bienvenido idetificate");

  socket.on("id", id => {
    console.log(`El cliente con id ${socket.id} se ha identificado como ${id}`);
    socket.broadcast.emit("Nuevo cliente", id);
  });

  //parte -02 recibe un mesaje atravez del socket
  socket.on("Nuevo mensaje", (nombre, mensaje) => {
    serverSocket.emit("mensaje", nombre, mensaje); //parte -03 envia emit un mesaje atravez del socket
  });
});

let temperatura = 0;
setInterval(() => {
  temperatura = Math.floor(Math.random() * 6 + 28);
  serverSocket.emit("nuervaLecturaDeTemperatura", temperatura);
}, 1000);
