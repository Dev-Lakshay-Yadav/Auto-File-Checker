import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { processPdfText } from "../utils/textExtractionUtils.js";

// --------------  Basically Extract the json data from pdf text  -----------------
// processedCaseData = {
//   "file_Prefix": "JU06706 -- Julie Wogan",
//   "service_Type": "Crown And Bridge",
//   "tooth_Numbers": [1,2,4],
//   "additional_Notes": "hello string"
// }

export const extractCaseDetailsFromPDF = async (folderPath: string) => {
  const filePath = `${folderPath}/CaseDetails.pdf`;
  const pdfData = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  const processedCaseData = await processPdfText(fullText);
  return processedCaseData;
};
