const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT } = require("../middlewares/");
const {
  crearCategoria,
  modificarCategoria,
  categoriaEliminaroActivar,
  obtenerCategoria,
  obtenerCategorias,
} = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

router.get("/", [validarJWT, validarCampos], obtenerCategorias);
router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoria),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  modificarCategoria
);
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos,
  ],
  categoriaEliminaroActivar
);
module.exports = router;
