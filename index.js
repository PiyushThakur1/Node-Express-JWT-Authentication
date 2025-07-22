const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "USER_APP";
const app = express();
app.use(express.json());

const users = [];

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "You are signed up",
  });
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      foundUser = users[i];
    }
  }

  if (!foundUser) {
    res.json({
      message: "Credentials incorrect",
    });
    return;
  } else {
    const token = jwt.sign(
      {
        username: foundUser.username,
      },
      JWT_SECRET
    );

    res.header("jwt", token);

    res.header("random", "harkirat");

    res.json({
      token: token,
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
  // req = {status, headers...., username, password, userFirstName, random; ":123123"}
  const currentUser = req.username;
  // const token = req.headers.token;
  // const decodedData = jwt.verify(token, JWT_SECRET);
  // const currentUser = decodedData.username

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === currentUser) {
      foundUser = users[i];
    }
  }

  res.json({
    username: foundUser.username,
    password: foundUser.password,
  });
});

app.listen(3000);
