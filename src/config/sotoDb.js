const { mongoose } = require("mongoose");

const sotoDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DDBB");
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { sotoDb };