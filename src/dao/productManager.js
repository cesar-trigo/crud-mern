import fs from "fs";

export default class ProductManager {
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
      console.error("Error updating file");
    }
  };

  // METODO PARA AGREGAR PRODUCTOS
  addProduct = async obj => {
    try {
      let products = await this.readFile();
      //configuro el obj
      let newProduct = {
        title: obj.title,
        description: obj.description,
        price: obj.price,
        thumbnails: obj.thumbnails ?? [],
        code: obj.code,
        stock: obj.stock,
        category: obj.category,
        status: true,
      };

      if (products.some(product => product.code === newProduct.code)) {
        throw new Error("Repeated code");
      }

      // Verificar que todos los campos estén presentes
      for (const prop in newProduct) {
        if (newProduct[prop] === undefined) {
          throw new Error(`Field missing ${prop}`);
        }
      }

      // Asignar un nuevo ID después de actualizar el archivo
      let id = Math.max(...products.map(e => e.id), 0) + 1;
      newProduct.id = id;

      // Agregar el nuevo producto al array de datos
      products.push(newProduct);

      //y actualizar el archivo
      await this.sendFile(products);

      return { message: "Product Loaded Successfully", product: newProduct };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //METODO PARA LEER LOS PRODUCTOS JSON
  getProducts = async () => {
    try {
      return await this.readFile();
    } catch (error) {
      new Error("Error reading file");
    }
  };

  // METODO PARA BUSCAR POR ID EN JSON
  getProductById = async prodId => {
    try {
      const data = await this.readFile();

      const productById = data.find(e => e.id === prodId);
      if (!productById) {
        throw new Error(`Does not work wrong id: ${prodId}`);
      }
      return productById;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // METODO PARA MODIFICAR POR ID EN PRODUCTOS
  updateProduct = async (idProd, obj) => {
    try {
      const data = await this.readFile();

      const idProduct = data.find(produc => produc.id === idProd);

      if (!idProduct) {
        throw new Error(`error id: ${idProd} not found`);
      }

      if (data.some(product => product.code === obj.code)) {
        throw new Error("Repeated code");
      }

      Object.keys(obj).forEach(prop => {
        idProduct[prop] = obj[prop];
      });

      idProduct.id = idProduct.id;

      await this.sendFile(data);

      return { message: "Product updated successfully", product: idProduct };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // METODO PARA ELIMINAR POR ID EN PRODUCTOS
  deleteProduct = async prodId => {
    try {
      const data = await this.readFile();

      const productById = data.findIndex(e => e.id === prodId);

      return !(productById >= 0)
        ? (() => {
            throw new Error(`Not found`);
          })()
        : (data.splice(productById, 1), await this.sendFile(data));
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
