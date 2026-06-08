const Booking = require("../Models/BookingModel");

// POST /api/booking — Save new booking
const createBooking = async (req, res) => {
    try {
        console.log('--- BOOKING REQUEST RECEIVED ---');
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const { name, email, phone, packageName, destination, persons, travelDate, paymentMethod, specialRequest } = req.body;

        // Check each required field manually and report which is missing
        const missing = [];
        if (!name)          missing.push('name');
        if (!email)         missing.push('email');
        if (!phone)         missing.push('phone');
        if (!packageName)   missing.push('packageName');
        if (!destination)   missing.push('destination');
        if (!persons)       missing.push('persons');
        if (!travelDate)    missing.push('travelDate');
        if (!paymentMethod) missing.push('paymentMethod');

        if (missing.length > 0) {
            console.log('Missing fields:', missing);
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missing.join(', ')}`
            });
        }

        const booking = new Booking({
            name,
            email,
            phone,
            packageName,
            destination,
            persons:        Number(persons),
            travelDate,
            paymentMethod,
            specialRequest: specialRequest || ''
        });

        const saved = await booking.save();
        console.log('Booking saved successfully. ID:', saved._id);
        res.status(201).json({ message: "Booking confirmed successfully.", data: saved });

    } catch (error) {
        console.error('--- BOOKING SAVE ERROR ---');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        res.status(500).json({
            success: false,
            message: error.message,
            validationErrors: error.errors ? Object.keys(error.errors).map(k => error.errors[k].message) : []
        });
    }
};

// GET /api/booking — Get all bookings (Admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Bookings fetched.", data: bookings });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings.", error: error.message });
    }
};

// GET /api/booking/user/:email — Get bookings for logged-in user
const getBookingsByEmail = async (req, res) => {
    try {
        const bookings = await Booking.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json({ message: "User bookings fetched.", data: bookings });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user bookings.", error: error.message });
    }
};

// PUT /api/booking/:id — Update booking status (Admin: Approve/Reject)
const updateBookingStatus = async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json({ message: "Status updated.", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status.", error: error.message });
    }
};

// DELETE /api/booking/:id — Delete a booking (Admin)
const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete booking.", error: error.message });
    }
};

module.exports = { createBooking, getAllBookings, getBookingsByEmail, updateBookingStatus, deleteBooking };
