const express = require("express");
const router = express.Router();
const { createBooking, getAllBookings, getBookingsByEmail, updateBookingStatus, deleteBooking } = require("../Controllers/BookingController");

// POST /api/booking
router.post("/", createBooking);

// GET /api/booking
router.get("/", getAllBookings);

// GET /api/booking/user/:email
router.get("/user/:email", getBookingsByEmail);

// PUT /api/booking/:id
router.put("/:id", updateBookingStatus);

// DELETE /api/booking/:id
router.delete("/:id", deleteBooking);

module.exports = router;
