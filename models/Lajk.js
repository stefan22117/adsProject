var mongoose = require("mongoose");

var LajkSchema = new mongoose.Schema({
    OglasId: mongoose.Schema.Types.Number,
    LajkDislajk: mongoose.Schema.Types.Boolean,
    KorisnikUsername: mongoose.Schema.Types.String,
});

var Lajk = mongoose.model("Lajk", LajkSchema);

module.exports = Lajk;