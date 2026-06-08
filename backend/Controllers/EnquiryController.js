const Enquiry = require("../Models/EnquiryModel");

// POST /api/enquiry — Save new enquiry to MongoDB
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, destination, date, message } = req.body;

        const newEnquiry = new Enquiry({ name, email, phone, destination, date, message });
        const saved = await newEnquiry.save();

        res.status(201).json({ message: "Enquiry submitted successfully.", data: saved });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit enquiry.", error: error.message });
    }
};

// GET /api/enquiry — Fetch all enquiries from MongoDB
const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Enquiries fetched successfully.", data: enquiries });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch enquiries.", error: error.message });
    }
};

// DELETE /api/enquiry/:id — Delete an enquiry (Admin)
const deleteEnquiry = async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Enquiry deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete enquiry.", error: error.message });
    }
};

module.exports = { createEnquiry, getAllEnquiries, deleteEnquiry };
