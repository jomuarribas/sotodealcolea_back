const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    memberNumber: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    state: { type: String, enum: ["Open", "Close"], default: "Open" },
    priority: { type: String, enum: ["Alta", "Media", "Baja"], default: "low" },
  },
  {
    collection: "incidents"
  }
);

const Incident = mongoose.model("Incident", incidentSchema, "incidents");
module.exports = Incident;