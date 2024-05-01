import { Router } from "express";
import ProductManager from "../dao/productManager.js";
import { join } from "path";
import __dirname, { upload } from "../utils.js";
import { io as serverSocket } from "../app.js";
// Inicialización de recursos
const router = Router();
const filepath = join(__dirname, "data", "products.json");
const productManager = new ProductManager(filepath);

router.get("/", async (req, res) => {
  let limit = Number(req.query.limit);
  let products = await productManager.getProducts();
  try {
    if (req.query.limit !== undefined && isNaN(limit)) {
      return res.status(404).json({ error: "The limit parameter must be a valid number" });
    }

    if (limit && limit > 0) {
      products = products.slice(0, limit);
    }

    return res.status(200).json({
      response: products,
      success: true,
      message: "products read successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:pid", async (req, res) => {
  let { pid } = req.params;
  try {
    if (isNaN(pid) || pid <= 0) {
      return res.status(404).json({ error: "Product ID must be a positive integer" });
    }

    const product = await productManager.getProductById(Number(pid));

    return res.status(200).json({
      response: product,
      success: true,
      message: "product read successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", upload.array("thumbnails"), async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  const thumbnails = req.files ? req.files.map(file => file.path) : undefined;
  const typeString = [title, description, code, category],
    typeNumber = [Number(price), Number(stock)];

  try {
    if (typeString.some(e => e !== undefined && typeof e !== "string")) {
      return res.status(404).json({ error: `formato invalido1` });
    }

    /*     if (thumbnails && thumbnails.some(e => e !== undefined && typeof e !== "string")) {
      return res.status(404).json({ error: `formato invalido2` });
    } */

    if (typeNumber.some(e => e !== undefined && isNaN(e))) {
      return res.status(404).json({ error: `formato invalido3 ${thumbnails}` });
    }

    if (typeNumber.some(e => e < 0)) {
      return res.status(404).json({ error: `el numero no debe ser menor a 0` });
    }

    const result = await productManager.addProduct(req.body, thumbnails);

    serverSocket.emit("newProduct", result);

    return res.status(201).json({
      response: result,
      success: true,
      message: "product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:pid", async (req, res) => {
  let { pid } = req.params;

  const { title, description, code, price, stock, thumbnails, category } = req.body;

  const typeString = [title, description, code, category],
    typeNumber = [price, stock];

  try {
    if (isNaN(pid) || pid <= 0) {
      return res.status(404).json({ error: "Product ID must be a positive integer" });
    }

    if (typeString.some(e => e !== undefined && typeof e !== "string")) {
      return res.status(404).json({ error: `formato invalido` });
    }

    if (thumbnails && thumbnails.some(e => typeof e !== "string")) {
      return res.status(404).json({ error: `formato invalido` });
    }

    if (typeNumber.some(e => e !== undefined && typeof e !== "number")) {
      return res.status(404).json({ error: `formato invalido` });
    }

    if (typeNumber.some(e => e < 0)) {
      return res.status(404).json({ error: `el numero no debe ser menor a 0` });
    }

    const result = await productManager.updateProduct(Number(pid), req.body);

    serverSocket.emit("productModification", result);
    console.log(result);

    return res.status(200).json({
      response: result,
      success: true,
      message: "product updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    if (isNaN(pid) || pid <= 0) {
      return res.status(404).json({ error: "Product ID must be a positive integer" });
    }

    const result = await productManager.deleteProduct(Number(pid));

    serverSocket.emit("deleteProduct", result);

    return res.status(200).json({
      response: result,
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
