const express = require("express");
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require("../Controllers/ContactController");

// POST /api/contact
router.post("/", createContact);

// GET /api/contact
router.get("/", getAllContacts);

// DELETE /api/contact/:id
router.delete("/:id", deleteContact);

module.exports = router;
