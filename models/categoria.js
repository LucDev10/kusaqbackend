const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: [true, "El usuario es obligatorio"],
    ref: "Usuario",
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("Categoria", CategoriaSchema);
