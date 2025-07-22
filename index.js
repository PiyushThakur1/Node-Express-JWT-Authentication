const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "USER_APP";
const app = express();
app.use(express.json());

const users = [];

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "You are signed up",
  });
  console.log(users);
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.json({
      message: "Incorrect Credentials",
    });
  } else {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );

    res.header("jwt", token);
    res.json({
      token,
    });
  }
});

function auth(req, res, next) {
  const token = req.headers.token; // jwt
  const decodeInfo = jwt.verify(token, JWT_SECRET);
  if (decodeInfo.username) {
    req.username = decodeInfo.username;
    next();
  } else {
    res.json({
      message: "You are not Logged in",
    });
  }
}
app.get("/me", auth, (req, res) => {
  let founduser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == req.username) {
      founduser = users[i];
    }
  }
  res.json({
    username: founduser.username,
    password: founduser.password,
  });
});

app.listen(3000);
