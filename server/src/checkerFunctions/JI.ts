import { mainCheckerFunctionJI } from "../checkerUtils/JIcheckerUtils.js";
import { PdfDataJI, FolderData, ResultJI } from "../types/commonTypes.js";

export type ResultData = ResultJI | null;

export const checkJICases = async (
  pdfData: PdfDataJI,
  folderData: FolderData
): Promise<ResultData> => {
  try {
    const errors: string[] = [];

    if (pdfData.service_Type !== null) {
      errors.push("some service type detected in JI");
    }

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

    if (errors.length === 0) {
      const err = await mainCheckerFunctionJI(pdfData, folderData);
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
