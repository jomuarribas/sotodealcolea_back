require("dotenv").config();

const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const usersRoutes = require("./src/api/routes/user");
const residentialsRoutes = require("./src/api/routes/residential");
const incidentsRoutes = require("./src/api/routes/incident");
const expensesRoutes = require("./src/api/routes/expense");
const { sotoDataBase } = require("./src/config/sotoDataBase");

const app = express();

sotoDataBase()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(express.json());
app.use(cors());
app.use(express.static('src'));

app.use("/users", usersRoutes);
app.use("/residentials", residentialsRoutes);
app.use("/expenses", expensesRoutes);
app.use("/incidents", incidentsRoutes);

app.use("*/", (req, res, next) => {
  return res.status(404).json("Route not found")
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});