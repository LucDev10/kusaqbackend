const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT } = require("../middlewares");
const { existeCategoria, existeProducto } = require("../helpers/db-validators");
const {
  crearProducto,
  modificarProducto,
  productoEliminaroActivar,
  productoDisponible,
  obtenerProductos,
  obtenerProducto,
} = require("../controllers/producto");

const router = Router();

router.get("/", [validarJWT, validarCampos], obtenerProductos);
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("categoria").custom(existeCategoria),
    check("id").custom(existeProducto),

    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  modificarProducto
);
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),

    check("id").custom(existeProducto),
    validarCampos,
  ],
  productoEliminaroActivar
);
router.delete(
  "/disponible/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),

    check("id").custom(existeProducto),
    validarCampos,
  ],
  productoDisponible
);
module.exports = router;
