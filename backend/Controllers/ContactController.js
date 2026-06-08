const Contact = require("../Models/ContactModel");

// POST /api/contact — Save contact message
const createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const saved = await contact.save();
        res.status(201).json({ message: "Message sent successfully.", data: saved });
    } catch (error) {
        res.status(500).json({ message: "Failed to send message.", error: error.message });
    }
};

// GET /api/contact — Get all contact messages (Admin)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Messages fetched.", data: contacts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages.", error: error.message });
    }
};

// DELETE /api/contact/:id — Delete a contact message (Admin)
const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Message deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete message.", error: error.message });
    }
};

module.exports = { createContact, getAllContacts, deleteContact };
