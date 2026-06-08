const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    phone:       { type: String, required: true },
    destination: { type: String, required: true },
    date:        { type: String, required: true },
    message:     { type: String, default: "" },
    createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Enquiry", enquirySchema);
