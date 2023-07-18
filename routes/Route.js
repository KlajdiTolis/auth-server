const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const { createToken, validateToken } = require("../JWT");

const { User, TestColl } = require("../models/Model");

app.get("/users", async (request, response) => {
  const users = await User.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/testColl", (req, res) => {
  const user = new TestColl({ name: req.body.name, price: req.body.price });
  user.save();
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new User({ username: username, password: hash });
      user.save();
    })
    .then(() => {
      res.json("User Registed");
    })
    .catch((err) => res.status(400).json({ error: err }));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  // console.log(user);
  if (!user) {
    return res.status(400).json({ error: "User Doesn't Exist" });
  }

  const dbPassword = user.password;
  const match = await bcrypt.compare(password, dbPassword);

  if (!match) {
    return res
      .status(400)
      .json({ error: "Wrong Username and Password Combination!" });
  } else {
    const accessToken = createToken(user);

    res.cookie("access_token", accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
    });

    // console.log(accessToken);
    res.json({ access_token: accessToken, message: "LOGGED IN" });
    // res.json({ message: "LOGGED IN" });
  }
});

app.get("/profile", validateToken, (req, res) => {
  res.json("profile");
});

module.exports = app;
