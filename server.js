// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PDFDocument = require("pdfkit");
const Applicant = require("./applicantModel");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Get all applicants
app.get("/api/applicants", async (req, res) => {
  try {
    const applicants = await Applicant.find().sort({ submissionDate: -1 });
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applicants", error: error.message });
  }
});

// ✅ Generate styled PDF
app.get("/api/applicants/:id/pdf", async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${applicant.fullName || "Applicant"}_Form.pdf"`
    );
    doc.pipe(res);

    // --- HEADER ---
    doc.fontSize(22).fillColor("#004aad").text("PSNA Foundation Technology", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(13).fillColor("gray").text("Application Form Details", { align: "center" });
    doc.moveDown(1);

    // helper for sections
    function addSection(title) {
      doc.moveDown(0.8);
      doc.rect(50, doc.y, 500, 22).fill("#f0f4ff").stroke();
      doc.fillColor("#004aad").fontSize(13).text(title, 60, doc.y - 16);
      doc.moveDown(0.6);
      doc.fillColor("black").fontSize(11);
    }

    // helper for rows
    function addRow(label, value) {
      doc.font("Helvetica-Bold").text(`${label}:`, { continued: true });
      doc.font("Helvetica").text(` ${value || "-"}`);
      doc.moveDown(0.2);
    }

    // --- PERSONAL DETAILS ---
    addSection("Personal Details");
    addRow("Full Name", applicant.fullName);
    addRow("Email", applicant.email);
    addRow("Mobile", applicant.mobile);
    addRow("Age", applicant.age);
    addRow("Address", `${applicant.address || ""}, ${applicant.city || ""}, ${applicant.state || ""}`);
    addRow("Country", applicant.country);
    addRow("Education", applicant.education);

    // --- BUSINESS DETAILS ---
    addSection("Business Details");
    addRow("Business Name", applicant.businessName);
    addRow("Business Description", applicant.businessDescription);
    addRow("Product Description", applicant.productDescription);
    addRow("Novelty", applicant.novelty);
    addRow("Team Size", applicant.teamSize);
    addRow("Competitors", applicant.competitors);
    addRow("Market Size", applicant.marketSize);
    addRow("Market Survey", applicant.marketSurvey);
    addRow("Validation Survey", applicant.validationSurvey);

    // --- COST ESTIMATE ---
    addSection("Cost Estimates");
    addRow("Pre-Operational", applicant.preOp);
    addRow("Prototype", applicant.prototype);
    addRow("Marketing", applicant.marketing);
    addRow("Equipment", applicant.equipment);
    addRow("Capital", applicant.capital);
    addRow("Other", applicant.other);
    addRow("Total Cost", applicant.totalCost);

    // --- REFERENCES ---
    addSection("References");
    addRow("Reference 1", `${applicant.ref1Name || ""}, ${applicant.ref1Org || ""}`);
    addRow("Reference 2", `${applicant.ref2Name || ""}, ${applicant.ref2Org || ""}`);

    // --- DECLARATION ---
    addSection("Declaration");
    addRow("Declaration Accepted", applicant.declaration ? "Yes" : "No");
    addRow("Date", applicant.date ? new Date(applicant.date).toLocaleDateString() : "-");
    addRow("Place", applicant.place);
    addRow("Submitted On", new Date(applicant.submissionDate).toLocaleString());

    // --- FOOTER ---
    doc.moveDown(1);
    doc.strokeColor("#004aad").lineWidth(1)
       .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#666")
       .text("Generated automatically by PSNA Admin Portal", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
});

// ✅ Health check
app.get("/", (req, res) => res.send("Admin Backend Running! 🚀"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
