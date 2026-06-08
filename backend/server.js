const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware — allow React frontend to call this backend
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected Successfully");
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

// Start server on port 5000
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
