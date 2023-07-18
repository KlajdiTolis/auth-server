const express = require("express");
const Router = require("./routes/Route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  `mongodb+srv://klajdireact:IFKqVh38qPj56uOl@cluster0.js07dod.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(Router);

app.listen(5000, () => {
  console.log("Running");
});
