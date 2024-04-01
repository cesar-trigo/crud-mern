import fs from "fs";

export default class CartManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
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
      throw new Error(`error al grabar archivo`);
    }
  };

  // METODO PARA AGREGAR PRODUCTOS
  addCart = async () => {
    try {
      const carts = await this.readFile();

      // Asignar un nuevo ID después de actualizar el archivo
      const id = Math.max(...carts.map(e => e.id), 0) + 1;

      let newCart = {
        id: id,
        products: [],
      };

      // Agregar el nuevo producto al array de datos
      carts.push(newCart);

      //y actualizar el archivo
      await this.sendFile(carts);

      return "cart Loaded Successfully";
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // METODO PARA BUSCAR POR ID EN JSON
  getCartById = async cartId => {
    try {
      const carts = await this.readFile();

      const cartById = carts.find(e => e.id === cartId);

      if (!cartById) {
        throw new Error(`Does not work wrong id: ${cartId}`);
      }
      return cartById.products;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
