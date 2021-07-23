var mongoose = require("mongoose");

const dbUri = process.env.MONGODB_LOCAL || "mongodb+srv://julianzamt:Gualicho2@cluster0.iunbi.mongodb.net/caza?retryWrites=true&w=majority";

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
  if (error) {
    throw error;
  } else {
    console.log("Conectado a MongoDB");
  }
});

module.exports = mongoose;
