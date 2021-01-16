var mongoose = require("mongoose");

var KomentarSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.Number,
    tekst: mongoose.Schema.Types.String,
    OglasId: mongoose.Schema.Types.Number,
    KorisnikUsername: mongoose.Schema.Types.String
});

var Komentar = mongoose.model("Komentar", KomentarSchema);

module.exports = Komentar;