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
  if (user) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_SECRET
    );

    // user.token = token;
    res.json({
      token,
    });
  } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
  }
  console.log(user);
});

app.get("/me", (req, res) => {
  const token = req.headers.token; // jwt
  const decodeInfo = jwt.verify(token, JWT_SECRET);
  const username = decodeInfo.username;

  let founduser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      founduser = users[i];
    }
  }

  if (founduser) {
    res.json({
      username: founduser.username,
      password: founduser.password,
    });
  } else {
    res.json({
      message: "token invalid",
    });
  }
});

app.listen(3000);
