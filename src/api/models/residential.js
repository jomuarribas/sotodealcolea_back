const mongoose = require("mongoose");

const residentialSchema = new mongoose.Schema(
  {
    memberNumber: { type: String, trim: true, required: true },
    street: { type: String, enum: ["Ronda", "Bosque", "Encina", "Roble", "Castaño", "Pino"], required: true },
    number: { type: String, required: true },
    dimension: { type: String, enum: ["1 Parcela", "1 Parcela y media", "2 Parcelas", "3 Parcelas"], trim: true, default: "1 Parcela", required: true },
    debt: { type: String, trim: true, default: "Al corriente de pago" },
    sanctions: { type: String, default: "Esta parcela no tiene ninguna sanción" },
    img: { type: String },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
    incidents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Incident" }],
  },
  {
    collection: "residentials"
  }
);

const Residential = mongoose.model("Residential", residentialSchema, "residentials");
module.exports = Residential;