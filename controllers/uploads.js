const { v4 } = require("uuid");
const { response } = require("express");
const path = require("path");
const fs = require("fs");
const { subirArchivo } = require("../helpers/subir-archivo");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const cargarArchivo = async (req, res = response) => {
  try {
    const pathArchivo = await subirArchivo(req.files, ["txt", "md"], "textos");
    res.json({
      nombre: pathArchivo,
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};
const actualizarImagen = async (req, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        res.status(400).json({ msg: `No existe usuario con id ${id}` });
        return;
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        console.log(modelo);
        res.status(400).json({ msg: `No existe producto con id ${id}` });
        return;
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: "No valide esa opcion comunicate con el admin" });
  }

  //limpiar imagenes previas

  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const pathArchivo = await subirArchivo(req.files, undefined, coleccion);
  console.log(modelo);
  modelo.img = pathArchivo;
  await modelo.save();
  res.json(modelo);
};
const actualizarImagenCloudinary = async (req, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        res.status(400).json({ msg: `No existe usuario con id ${id}` });
        return;
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        console.log(modelo);
        res.status(400).json({ msg: `No existe producto con id ${id}` });
        return;
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: "No valide esa opcion comunicate con el admin" });
  }


  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    await cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;
  await modelo.save();
  res.json(modelo);
};
const mostrarImagen = async (req, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        res.status(400).json({ msg: `No existe usuario con id ${id}` });
        return;
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        res.status(400).json({ msg: `No existe producto con id ${id}` });
        return;
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: "No valide esa opcion comunicate con el admin" });
  }


  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
  const Imagenrelleno = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(Imagenrelleno);
};
const mostrarImagenCloudinary = async (req, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        res.status(400).json({ msg: `No existe usuario con id ${id}` });
        return;
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        res.status(400).json({ msg: `No existe producto con id ${id}` });
        return;
      }
      break;

    default:
      return res
        .status(500)
        .json({ msg: "No valide esa opcion comunicate con el admin" });
  }

  // Si el modelo tiene una imagen en Cloudinary
  if (modelo.img) {
    // Simplemente envía la URL segura como respuesta
    return res.send(modelo.img);
  }

  // Si no hay imagen en Cloudinary, envía una imagen de relleno
  const Imagenrelleno = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(Imagenrelleno);
};
module.exports = {
  cargarArchivo,
  actualizarImagen,
  actualizarImagenCloudinary,
  mostrarImagen,
  mostrarImagenCloudinary
};
