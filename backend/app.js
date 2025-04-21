const express = require("express");
const { initializeRoutes } = require("./routes");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
express.json();
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET, // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` if using HTTPS
  })
);

const corsOptions = {
  origin: ["*", "http://localhost:5173"], // Allow requests from this origin
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const port = process.env.PORT || 4000;

app = initializeRoutes(app);

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "welcome to the beginning of greatness",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
