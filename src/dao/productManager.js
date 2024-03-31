import fs from "fs";

export default class ProductManager {
  #products;

  constructor(rutaArchivo) {
    this.path = rutaArchivo; //--------hay cambiar a una forma correcta!!!
  }

  //PARA LEER EL ACHIVO JSON
  readFile = async () => {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" })); //--------hay que arreglar!!!
    }
    return [];
  };

  //PARA ACTULIZAR ACHIVO JSON
  sendFile = async arr => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(arr, null, 2)); //--------hay que arreglar!!!!
    } catch (error) {
      console.error("Error updating file");
    }
  };

  // METODO PARA AGREGAR PRODUCTOS
  addProduct = async obj => {
    //arreglar
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
      let id = Math.max(...products.map(e => e.id), 0) + 1; //--------hay que revisar!!!!
      newProduct.id = id;

      // Agregar el nuevo producto al array de datos
      products.push(newProduct);

      //y actualizar el archivo
      await this.sendFile(products);

      return "Product Loaded Successfully";
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

      const idEvent = data.find(produc => produc.id === idProd);
      if (!idEvent) {
        throw new Error(`error id: ${idProd} not found`);
      }

      Object.keys(obj).forEach(prop => {
        idEvent[prop] = obj[prop];
      });

      await this.sendFile(data);
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
        ? console.error(`Not found`)
        : (data.splice(productById, 1), await this.sendFile(data));
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
