const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    surnames: { type: String },
    telephone: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    img: { type: String },
    residential: { type: mongoose.Schema.Types.ObjectId, ref: "Residential" },
    category: { type: String, enum: ["socio", "beneficiario"], trim: true, required: true },
    rol: { type: String, enum: ["admin", "user"], trim: true, default: "user", required: true },
    verified: { type: Boolean, default: false, required: true },
  },
  {
    collection: "users",
  });

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10)
});

userSchema.pre('finOneAndUpdate', function () {
  console.log(this.category)
})

const User = mongoose.model("User", userSchema, "users")
module.exports = User;