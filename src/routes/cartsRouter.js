import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import { join } from "path";
import __dirname from "../utils.js";

// Inicialización de recursos

const router = Router();
const filepath = join(__dirname, "data", "carrito.json");
const cartManager = new CartManager(filepath);

router.post("/", async (req, res) => {
  try {
    return res.status(200).json(await cartManager.addCart());
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
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

    return res.status(200).json(await cartManager.getCartById(Number(cid)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// router.post("/:cid/product/:pid", async (req, res) => {
//   // res.setHeader("Content-Type", "text/plain");
//   const { title, description, code, price, stock, thumbnails, category } = req.body;

//   const typeString = [title, description, code, category],
//     typeNumber = [price, stock];

//   try {
//     if (typeString.some(e => typeof e !== "string")) {
//       return res.status(404).json({ error: `formato invalido` });
//     }

//     if (thumbnails && thumbnails.some(e => typeof e !== "string")) {
//       return res.status(404).json({ error: `formato invalido` });
//     }

//     if (typeNumber.some(e => typeof e !== "number")) {
//       return res.status(404).json({ error: `formato invalido` });
//     }

//     if (typeNumber.some(e => e < 0)) {
//       return res.status(404).json({ error: `el numero no debe ser menor a 0` });
//     }

//     return res.status(200).json(await productManager.addProduct(req.body));
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: "Internal Server Error",
//       message: error.message,
//     });
//   }
// });

export default router;
