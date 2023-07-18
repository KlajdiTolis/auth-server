const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    "secretJWTtoken"
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access_token"];

  if (!accessToken) {
    return res.status(400).json({ error: "User not Authenticated" });
  }

  try {
    const validToken = verify(accessToken, "secretJWTtoken");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createToken, validateToken };
