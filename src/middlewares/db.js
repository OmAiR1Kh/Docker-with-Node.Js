const mongoose = require("mongoose");

const DB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => console.log(err.message));
};

module.exports = DB