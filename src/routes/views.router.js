import { Router } from "express";
import { io } from "../app.js";
import ProductManager from "../dao/productManager.js";
export const router = Router();

const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  const product = await productManager.getProducts();

  res.setHeader("Content-Type", "text/html");
  res.status(200).render("home", {
    product,
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const productRea = await productManager.getProducts();

  io.on("connection", async socket => {
    console.log("cliente conectado", socket.id);
  });

  res.setHeader("Content-Type", "text/html");
  res.status(200).render("realTimeProducts", {
    productRea,
  });
});
