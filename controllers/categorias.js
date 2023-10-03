const { response, request } = require("express");

const Categoria = require("../models/categoria");

const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findById(id).populate(
      "usuario",
      "nombre"
    );
    res.json(categoria);
  } catch (error) {}
};
const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({
    nombre: nombre,
    _id: { $ne: id }, // $ne significa "not equal", por lo que excluye el ID actual
  });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `la categoria ${categoriaDB.nombre}, ya existe`,
    });
  }
  const data = new Categoria({
    nombre,
    usuario: req.usuario._id,
  });
  try {
    const categoriagrabada = new Categoria(data);
    await categoriagrabada.save();
    res.json({
      categoriagrabada,
    });
  } catch (error) {
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

const modificarCategoria = async (req, res) => {
  const { id } = req.params;
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoría ${categoriaDB.nombre}, ya existe`,
    });
  }

  const categoriacambiar = {
    nombre: nombre,
  };

  try {
    const categoriagrabada = await Categoria.findByIdAndUpdate(
      id,
      categoriacambiar,
      { new: true }
    ); // El parámetro { new: true } es para que retorne la versión actualizada del documento

    res.json(categoriagrabada);
  } catch (error) {
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};
const categoriaEliminaroActivar = async (req, res = response) => {
  const { id } = req.params;
  try {
    const categoriaActual = await Categoria.findById(id);
    if (!categoriaActual) {
      return res.status(404).json({
        msg: "Categoría no encontrada",
      });
    }
    const nuevoEstado = !categoriaActual.estado;
    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true }
    );
    res.json(categoria);
  } catch (error) {
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  modificarCategoria,
  categoriaEliminaroActivar,
};
