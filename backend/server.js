const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow requests from Netlify frontend
app.use(cors({ origin: "https://radiant-fudge-d2f652.netlify.app" }));
app.use(express.json());

// Auto-seed admin account on server start if it does not exist
const User = require("./Models/UserModel");
const seedAdmin = async () => {
    try {
        const existing = await User.findOne({ email: 'admin@aspire.com' });
        if (!existing) {
            await User.create({
                name: 'Admin',
                email: 'admin@aspire.com',
                phone: '0000000000',
                password: 'Admin123',
                role: 'admin'
            });
            console.log('Admin account created: admin@aspire.com');
        } else {
            // Ensure existing record has role: admin
            if (existing.role !== 'admin') {
                existing.role = 'admin';
                await existing.save();
                console.log('Admin role updated for: admin@aspire.com');
            } else {
                console.log('Admin account already exists.');
            }
        }
    } catch (err) {
        console.error('Admin seed error:', err.message);
    }
};

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected Successfully");
        seedAdmin(); // run after connection
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error);
    });

// Routes
const UserRouter = require("./Routers/UserRouter");
app.use("/api/user", UserRouter);

const EnquiryRouter = require("./Routers/EnquiryRouter");
app.use("/api/enquiry", EnquiryRouter);

const BookingRouter = require("./Routers/BookingRouter");
app.use("/api/booking", BookingRouter);

const ContactRouter = require("./Routers/ContactRouter");
app.use("/api/contact", ContactRouter);

// Use Render's dynamic PORT or fallback to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
