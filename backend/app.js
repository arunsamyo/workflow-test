const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./connection/connection");
const cors = require("cors");
const dotenv = require("dotenv");
const workflowRoute = require('./routes/workflow');
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api',workflowRoute);
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
// Database Connection
const DATABASE_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
connectDB(DATABASE_URL, DB_NAME);
