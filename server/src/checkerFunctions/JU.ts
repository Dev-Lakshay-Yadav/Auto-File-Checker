import { mainCheckerFunctionJU } from "../checkerUtils/JUcheckerUtils.js";
import { PdfData, FolderData, Result } from "../types/commonTypes.js";

export type ResultData = Result | null;

export const checkJUCases = async (
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
        errors.push(`No Export files found with name ${pdfData.file_Prefix}.`);
      }
    }

    if (pdfData.tooth_Numbers.length === 0) {
      errors.push("No tooth numbers found in PDF.");
    }

    if (errors.length === 0) {
      const err = await mainCheckerFunctionJU(pdfData, folderData);
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
