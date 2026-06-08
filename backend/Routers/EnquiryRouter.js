const express = require("express");
const router = express.Router();

const { createEnquiry, getAllEnquiries, deleteEnquiry } = require("../Controllers/EnquiryController");

// POST /api/enquiry
router.post("/", createEnquiry);

// GET /api/enquiry
router.get("/", getAllEnquiries);

// DELETE /api/enquiry/:id
router.delete("/:id", deleteEnquiry);

module.exports = router;
