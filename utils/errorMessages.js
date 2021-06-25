module.exports = {
  GENERAL: {
    required: "Required Field: {PATH}",
    maxlength: "The maximum length for the {PATH} field is 50 chars (280 for page text field)",
    unique: "Email/username already used",
    dbError: "Error accesing the DB. Please try again.",
  },
  USERS: {
    usernameAlreadyTaken: "El username ya existe. Por favor elija otro.",
    passwordIncorrect: "El password debe contener como mínimo 6 caracteres, y al menos 1 número, 1 minúscula y una 1 mayúscula.",
    badUserOrPassword: "Usuario y/o contraseña son incorrectos.",
    allFieldsRequired: "Todos los campos son obligatorios.",
    secretKey: "No, esa no es la Secret Key.",
  },
};
