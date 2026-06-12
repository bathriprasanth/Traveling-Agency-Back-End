const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS — allow Netlify frontend and local dev
app.use(cors({
    origin: ["https://radiant-fudge-d2f652.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());

// Always force-set admin password and role on every server start
const User = require("./Models/UserModel");
const seedAdmin = async () => {
    try {
        const existing = await User.findOne({ email: "admin@aspire.com" });
        if (!existing) {
            await User.create({
                name: "Admin",
                email: "admin@aspire.com",
                phone: "0000000000",
                password: "Admin123",
                role: "admin"
            });
            console.log("Admin created: admin@aspire.com / Admin123");
        } else {
            existing.password = "Admin123";
            existing.role = "admin";
            await existing.save();
            console.log("Admin verified: admin@aspire.com / Admin123");
        }
    } catch (err) {
        console.error("Admin seed error:", err.message);
    }
};

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected Successfully");
        seedAdmin();
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
