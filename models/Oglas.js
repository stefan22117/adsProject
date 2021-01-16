var mongoose = require("mongoose");

OglasSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.Number,
    slika: mongoose.Schema.Types.String,
    naslov: mongoose.Schema.Types.String,
    vrstaPlacanja: mongoose.Schema.Types.String,
    cena: mongoose.Schema.Types.Number,
    opis: mongoose.Schema.Types.String,
    KorisnikUsername: mongoose.Schema.Types.String,
    VrstaId: mongoose.Schema.Types.Number
});

Oglas = mongoose.model("Oglas", OglasSchema);

module.exports = Oglas;