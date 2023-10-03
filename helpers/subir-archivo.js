const { v4 } = require("uuid");
const { response } = require("express");
const path = require("path");
const subirArchivo = async (
  files,
  extensionesValidad = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    
    const nombreCortado = archivo.name.split(".");

    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensionesValidad.includes(extension)) {
      return reject(`Las extensiones permitidas son ${extensionesValidad}`);
    }
    const nombTemp = v4() + "." + extension;
    console.log(nombTemp);
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(nombTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
