import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import ProductManager from "../dao/productManager.js";
import { join } from "path";
import __dirname from "../utils.js";

// Inicialización de recursos

const router = Router();

const filepath = join(__dirname, "data", "carrito.json");
const filepathP = join(__dirname, "data", "products.json");
const cartManager = new CartManager(filepath);
const productManager = new ProductManager(filepathP);

router.post("/", async (req, res) => {
  try {
    const carts = await cartManager.addCart();
    return res.status(201).json({
      response: carts,
      success: true,
      message: `cart created successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:cid", async (req, res) => {
  let { cid } = req.params;

  try {
    if (isNaN(cid) || cid <= 0) {
      return res.status(404).json({ error: "Product ID must be a positive integer" });
    }

    const card = await cartManager.getCartById(Number(cid));

    return res.status(200).json({
      response: card,
      success: true,
      message: `cart was read successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const product = await productManager.getProductById(Number(pid));

    console.log(pid);
    if (isNaN(cid) || isNaN(pid)) {
      return res.status(400).json({ error: "must be numbers" });
    }

    if (product === undefined) {
      return res.status(400).json({ error: "error in product data" });
    }

    const param = {
      cid: Number(cid),
      pid: Number(pid),
      product: product,
    };

    const card = await cartManager.addProductToCart(param);

    return res.status(201).json({
      response: card.response,
      success: true,
      message: card.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
