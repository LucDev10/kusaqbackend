const categoria = require("../models/categoria");
const producto = require("../models/producto");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  // Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo: ${correo}, ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  // Verificar si el correo existe
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};
const existeCategoria = async (id) => {
  const categoriaActual = await categoria.findById(id);
  if (!categoriaActual) {
    throw new Error(`El id ${id} no existe`);
  }
};
const existeProducto = async (id) => {
  const ProductoActual = await producto.findById(id);
  if (!ProductoActual) {
    throw new Error(`El id ${id} no existe`);
  }
};
const coleccionesPermitidas = async (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if(!incluida){
    throw new Error (`La coleccion ${ coleccion } no es permitida - permitidas son ${colecciones}`);
    
  }
  return true;
};
module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto,
  coleccionesPermitidas,
};
