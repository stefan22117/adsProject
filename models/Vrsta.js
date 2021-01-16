var mongoose = require("mongoose");

var VrstaSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.Number,
    naziv: mongoose.Schema.Types.String,
});

var Vrsta = mongoose.model("Vrsta", VrstaSchema);

module.exports = Vrsta;