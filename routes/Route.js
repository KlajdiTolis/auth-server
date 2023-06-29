const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

const userModel = require("../models/Model");

app.get("/users", async (request, response) => {
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new userModel({ username: username, password: hash });
      user.save();
    })
    .then(() => {
      res.json("User Registed");
    })
    .catch((err) => res.status(400).json({ error: err }));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username: username });

    if (!user) {
      return res.status(400).json({ error: "User Doesn't Exist" });
    }
    const dbPassword = user.password;
    const match = await bcrypt.compare(password, dbPassword);

    if (!match) {
      return res
        .status(400)
        .json({ error: "Wrong Username and Password Combination!" });
    }

    res.json({ message: "LOGGED IN", accessToken: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" }); 
  }
});

module.exports = app;
