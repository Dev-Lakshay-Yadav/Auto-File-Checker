import { mainCheckerFunctionSA } from "../checkerUtils/SAcheckerUtils.js";

// ----------- Interfaces -------------
export interface PdfData {
  file_Prefix: string | null;
  service_Type: "Implant" | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
}

export type FolderData = string[];

// Result type
export interface Result {
  success: boolean;
  file_Prefix: string;
  service_Type: "Implant" | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
  error: string[];
}

export type ResultData = Result | null;

// ----------- Function (dynamic checks) -------------
export const checkSACases = async (
  pdfData: PdfData,
  folderData: FolderData
): Promise<ResultData> => {
  try {
    if (!pdfData.service_Type) {
      return null;
    }

    const errors: string[] = [];

    // --- validations ---
    if (!pdfData.file_Prefix) {
      errors.push("Missing file prefix in PDF.");
    } else {
      // make sure folder has a matching prefix
      const hasMatchingFolder = folderData.some((f) =>
        f.includes(pdfData.file_Prefix!)
      );
      if (!hasMatchingFolder) {
        errors.push(`No files found for ${pdfData.file_Prefix}.`);
      }
    }

    if (pdfData.tooth_Numbers.length === 0) {
      errors.push("No tooth numbers found in PDF.");
    }

    if (errors.length === 0) {
      const err = await mainCheckerFunctionSA(pdfData, folderData);
      if (err) {
        errors.push(...err);
      }
    }

    // --- build result ---
    if (errors.length === 0) {
      return {
        success: true,
        file_Prefix: pdfData.file_Prefix ?? "",
        service_Type: pdfData.service_Type,
        tooth_Numbers: pdfData.tooth_Numbers,
        additional_Notes: pdfData.additional_Notes,
        error: [],
      };
    } else {
      return {
        success: false,
        file_Prefix: pdfData.file_Prefix ?? "",
        service_Type: pdfData.service_Type,
        tooth_Numbers: pdfData.tooth_Numbers,
        additional_Notes: pdfData.additional_Notes,
        error: errors,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      file_Prefix: pdfData.file_Prefix ?? "",
      service_Type: pdfData.service_Type,
      tooth_Numbers: pdfData.tooth_Numbers,
      additional_Notes: pdfData.additional_Notes,
      error: [error.message || "Unknown error"],
    };
  }
};
