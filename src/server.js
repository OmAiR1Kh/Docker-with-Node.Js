const express = require("express");
const { config } = require("dotenv");
config();
const DB = require("./middlewares/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
DB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/api/user", userRoutes);

console.log(port);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listen Success on port ${port}`);
});
