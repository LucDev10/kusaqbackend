const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require("../controllers/uploads");
const {
  coleccionesPermitidas,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");

const router = Router();

router.post("/", [validarArchivoSubir, validarCampos], cargarArchivo);
router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "No es un ID válido").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);
router.get(
  "/:coleccion/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagenCloudinary
);

module.exports = router;
