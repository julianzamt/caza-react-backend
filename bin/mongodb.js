var mongoose = require("mongoose");

// Local
// mongoose.connect("mongodb://localhost/caza", { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
//   if (error) {
//     throw error;
//   } else {
//     console.log("Conectado a MongoDB");
//   }
// });

// Mongodb Atlas
mongoose.connect(
  "mongodb+srv://julianzamt:Gualicho2@cluster0.iunbi.mongodb.net/caza?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error) {
    if (error) {
      throw error;
    } else {
      console.log("Conectado a MongoDB");
    }
  }
);

module.exports = mongoose;
