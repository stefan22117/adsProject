var mongoose = require('mongoose');

var PorukaSchema = new mongoose.Schema({
    idPoruke: mongoose.Schema.Types.Number,
    odUsername: mongoose.Schema.Types.String,
    zaUsername: mongoose.Schema.Types.String,
    tekst: mongoose.Schema.Types.String,
    procitana: mongoose.Schema.Types.Boolean,
    vreme: mongoose.Schema.Types.Date
})

var Poruka = mongoose.model("Poruka", PorukaSchema);

module.exports = Poruka;