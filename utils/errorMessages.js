module.exports = {
  GENERAL: {
    required: "Campo requerido: {PATH}.",
    maxlength: "La extensión maxima permitida para {PATH} es {VALUE}",
    dbError: "Error en la conexión con la base de datos. Por favor inténtelo nuevamente.",
    s3Error: "Error en la conexión con el almacenamiento de imagenes. Por favor inténtelo nuevamente.",
    badRequest: "El ingreso de datos no se realizó correctamente. Por favor inténtelo de nuevo.",
  },
  USERS: {
    usernameAlreadyTaken: "El username ya existe. Por favor elija otro.",
    passwordIncorrect: "El password debe contener como mínimo 6 caracteres, y al menos 1 número, 1 minúscula y una 1 mayúscula.",
    badUserOrPassword: "Usuario y/o contraseña incorrectos.",
    allFieldsRequired: "Todos los campos son obligatorios.",
    secretKey: "No, esa no es la Secret Key.",
    tokenExpired: "Su sesión a expirado. Por favor vuelva a loguearse para continuar editando.",
    noToken: "No es posible reconocer al usuario. Por favor vuelva a loguearse.",
  },
};
