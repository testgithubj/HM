const express = require("express");
const db = require("./db/config");
const route = require("./controllers/route");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Set up CORS
app.use("/api/uploads", express.static("uploads"));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
//API Routes
app.use("/api", route);

app.get("/", async (req, res) => {
  res.send("Welcome to my world...");
});
app.use(function (req, res, next) {
  const allowedOrigins = ["*", "http://157.245.98.50:5000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
//API Routes

const server = app.listen(process.env.PORT, () => {
  const protocol =
    process.env.HTTPS === "true" || process.env.NODE_ENV === "production"
      ? "https"
      : "http";
  const { address, port } = server.address();
  const host = address === "::" ? "127.0.0.1" : address;
  console.log(`Server is listening at ${protocol}://${host}:${port}`);
});

// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
// const DATABASE_URL = 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || "HotelManagement";

db(DATABASE_URL, DATABASE);
