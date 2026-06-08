const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    name:           { type: String, required: true },
    email:          { type: String, required: true },
    phone:          { type: String, required: true },
    packageName:    { type: String, required: true },
    destination:    { type: String, required: true },
    persons:        { type: Number, required: true, min: 1 },
    travelDate:     { type: String, required: true },
    specialRequest: { type: String, default: "" },
    paymentMethod:  { type: String, required: true },
    status:         { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected"] },
    createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
