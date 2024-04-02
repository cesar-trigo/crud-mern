import fs from "fs";

export default class CartManager {
  constructor(filepath) {
    this.path = filepath;
  }
  //PARA LEER EL ACHIVO JSON
  readFile = async () => {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
    }
    return [];
  };

  //PARA ACTULIZAR ACHIVO JSON
  sendFile = async arr => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(arr, null, 2));
    } catch (error) {
      throw new Error(`Error saving file`);
    }
  };

  addCart = async () => {
    try {
      const carts = await this.readFile();

      const id = Math.max(...carts.map(e => e.id), 0) + 1;

      let newCart = {
        id: id,
        products: [],
      };

      carts.push(newCart);

      await this.sendFile(carts);

      return "cart Loaded Successfully";
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getCartById = async cartId => {
    const carts = await this.readFile();

    try {
      const cartById = carts.find(car => car.id === cartId);

      if (!cartById) {
        throw new Error(`Does not work wrong id: ${cartId}`);
      }

      return cartById.products;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addProductToCart = async param => {
    const carts = await this.readFile();

    try {
      const cartById = carts.find(car => car.id === param.cid);

      if (!cartById) {
        throw new Error(`There is no cart with ID ${param.cid}`);
      }
      const existingProduct = cartById.products.findIndex(pro => pro.product === param.product.id);

      existingProduct !== -1
        ? cartById.products[existingProduct].quantity++
        : cartById.products.push({ product: param.product.id, quantity: 1 });

      await this.sendFile(carts);

      return existingProduct !== -1 ? "Product quantity incremented" : "Product added to cart";
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
