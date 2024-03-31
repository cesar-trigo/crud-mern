import express from "express";
import ProductManager from "./dao/productManager.js";
import __dirname from "./utils.js";
import { join } from "path";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let filepath = join(__dirname, "data", "products.json");

const productManager = new ProductManager(filepath);

app.get("/products", async (req, res) => {
  let limit = Number(req.query.limit);
  let products = await productManager.getProducts();
  try {
    //res.setHeader("Content-Type", "text/plain");

    if (req.query.limit !== undefined && isNaN(limit)) {
      return res.status(404).json({ error: "The limit parameter must be a valid number" });
    }

    if (limit && limit > 0) {
      products = products.slice(0, limit);
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

app.get("/products/:pid", async (req, res) => {
  // res.setHeader("Content-Type", "text/plain");
  let { pid } = req.params;
  try {
    if (isNaN(pid) || pid <= 1) {
      return res.status(404).json({ error: "Product ID must be a positive integer" });
    }

    return res.status(200).json(await productManager.getProductById(Number(pid)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
