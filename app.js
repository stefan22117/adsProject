var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var multer = require("multer");

var controller = require("./controllers/controller");
var adminController = require("./controllers/adminController");
var session = require("express-session");

var app = express();

app.set("view engine", "ejs");

app.use(express.static("assets"));
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }))

router = express.Router();
controller(router);
app.use("/", router);

adminRouter = express.Router();
adminController(adminRouter);
app.use("/admin/", adminRouter);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).redirect('/error')
  })

mongoose.connect("mongodb://localhost/oglasi", { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = 3000;


app.listen(PORT)

