const { response, request } = require("express");

const Producto = require("../models/producto");

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { disponible: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  try {
    const categoria = await Producto.findById(id).populate(
      "categoria",
      "nombre"
    ).populate("usuario",
    "nombre");
    res.json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};
const crearProducto = async (req, res = response) => {
  const { precio, categoria, descripcion } = req.body;
  const nombre = req.body.nombre.toUpperCase();
  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.status(400).json({
      msg: `la categoria ${productoDB.nombre}, ya existe`,
    });
  }
  const data = new Producto({
    nombre,
    precio,
    categoria,
    descripcion,
    usuario: req.usuario._id,
  });
  try {
    const productograbada = new Producto(data);
    await productograbada.save();
    res.json({
      productograbada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

const modificarProducto = async (req, res) => {
  const { id } = req.params;
  const { precio, categoria, descripcion } = req.body;
  const nombre = req.body.nombre.toUpperCase();
  const productoDB = await Producto.findOne({
    nombre: nombre,
    _id: { $ne: id }, // $ne significa "not equal", por lo que excluye el ID actual
  });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  const productocambiar = {
    nombre: nombre,
    categoria: categoria,
    precio: precio,
    descripcion: descripcion,
  };

  try {
    const productograbada = await Producto.findByIdAndUpdate(
      id,
      productocambiar,
      { new: true }
    ); // El parámetro { new: true } es para que retorne la versión actualizada del documento

    res.json(productograbada);
  } catch (error) {
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};
const productoEliminaroActivar = async (req, res = response) => {
  const { id } = req.params;
  try {
    const productoActual = await Producto.findById(id);
    if (!productoActual) {
      return res.status(404).json({
        msg: "Producto no encontrado",
      });
    }
    const nuevoEstado = !productoActual.estado;

    let cambios = { estado: nuevoEstado };

    // Si el nuevo estado es false, cambia disponible a false
    if (!nuevoEstado) {
      cambios.disponible = false;
    }

    const producto = await Producto.findByIdAndUpdate(id, cambios, {
      new: true,
    });

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};
const productoDisponible = async (req, res = response) => {
  const { id } = req.params;
  try {
    const productoActual = await Producto.findById(id);
    if (!productoActual) {
      return res.status(404).json({
        msg: "Producto no encontrado",
      });
    }
    if (productoActual.estado == true) {
      const nuevoEstado = !productoActual.disponible;
      const producto = await Producto.findByIdAndUpdate(
        id,
        { disponible: nuevoEstado },
        { new: true }
      );
      res.json(producto);
    } else {
      res.status(400).json({
        msg: `El estado del producto es falso`,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  modificarProducto,
  productoEliminaroActivar,
  productoDisponible,
};
