// controllers/pdfController.ts
import { Request, Response } from "express";
import fs from "fs";
const pdf = require("pdf-parse");

// Controller to extract text from PDF
export const extractPdfText = async (req: Request, res: Response) => {
  try {
    const { pdfPath } = req.body;

    if (!pdfPath) {
      return res.status(400).json({ error: "pdfPath is required" });
    }

    // Read file buffer
    const dataBuffer = fs.readFileSync(pdfPath);

    // Parse PDF
    const data = await pdf(dataBuffer);

    return res.json({
      text: data.text, // extracted text
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata
    });
  } catch (error: any) {
    console.error("Error extracting PDF:", error);
    return res.status(500).json({ error: "Failed to extract text from PDF" });
  }
};
