const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);


app.get("/", (req, res) => {
  res.send("Home Page - Student Exam Portal");
});


app.post("/login", (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.send("Username and role required");
  }

  req.session.user = { username, role };

  res.cookie("role", role);

  res.send("Login successful");
});


app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.send("Please login first");
  }

  res.send(
    `Welcome ${req.session.user.username}, you are logged in as ${req.session.user.role}`
  );
});


app.get("/admin", (req, res) => {
  if (!req.session.user) {
    return res.send("Please login first");
  }

  if (req.session.user.role !== "admin") {
    return res.send("Access denied");
  }

  res.send("Welcome Admin Panel");
});


app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("role");
    res.send("Logout successful");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
