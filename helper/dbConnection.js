const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

exports.connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected successfully.");
  } catch (error) {
    console.error(error);
    console.log("DB connection failed.");
  }
};
