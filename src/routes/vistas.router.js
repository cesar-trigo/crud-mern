import { Router } from "express";
import ProductManager from "../dao/productManager.js";
export const router = Router();

const productManager = new ProductManager("./src/data/products.json");

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("inicio", { titulo: "Home Pagee" });
});

router.get("/productos", async (req, res) => {
  const productos = await productManager.getProducts();
  const nuemro = Math.floor(Math.random() * 20 + 0);
  const productDelDia = productos[nuemro];

  res.setHeader("Content-Type", "text/html");
  res.status(200).render("productos", {
    productDelDia,
    productos,
  });
});
