var mongoose = require("mongoose");

var KorisnikSchema = new mongoose.Schema({
    username: mongoose.Schema.Types.String,
    password: mongoose.Schema.Types.String,
    email: mongoose.Schema.Types.String,
    brojTel: mongoose.Schema.Types.String,
    role: mongoose.Schema.Types.String
});

var Korisnik = mongoose.model("Korisnik", KorisnikSchema);

module.exports = Korisnik;