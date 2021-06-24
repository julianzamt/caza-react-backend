module.exports = {
  GENERAL: {
    required: "Required Field: {PATH}",
    maxlength: "The maximum length for the {PATH} field is 50 chars (280 for page text field)",
    unique: "Email/username already used",
    dbError: "Error accesing the DB. Please try again.",
  },
  USERS: {
    userExist: "El {VALUE} ya existe",
    passwordIncorrect: "El {PATH} debe contener al menos 1 letra, 1 minuscula, 1 mayuscula",
    badUserOrPassword: "Usuario y/o contraseña son incorrectos.",
    allFieldsRequired: "Todos los campos son obligatorios.",
    confirmationMismatch: "Password y confirmación no coinciden.",
    secretKey: "Wrong Secret Key",
  },
};
