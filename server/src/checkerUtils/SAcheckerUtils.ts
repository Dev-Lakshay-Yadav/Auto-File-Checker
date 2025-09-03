import {
  countFilesExt,
  hasImageContaining,
  hasSTLContaining,
} from "./commonUtils.js";

import { PdfData, FolderData } from "../types/commonTypes.js";

export const mainCheckerFunctionSA = async (
  pdfData: PdfData,
  folderData: FolderData
): Promise<string[]> => {
  const errors: string[] = [];

  if (!(countFilesExt(folderData, [".html"]) > 0)) {
    errors.push("Missing .html file");
  }
  if (!(countFilesExt(folderData, [".zip"]) > 0)) {
    errors.push("Missing .zip file");
  }
  if (!(countFilesExt(folderData, [".stl"]) > 0)) {
    errors.push("Missing .stl file");
  }

  if (pdfData.service_Type === "Implant") {
    if (
      !(
        hasImageContaining(folderData, "2.8 mm hole") ||
        hasImageContaining(folderData, "2.8mm hole")
      )
    ) {
      errors.push("Missing image: 2.8 mm hole");
    }
    if (!hasImageContaining(folderData, "implant selection")) {
      errors.push("Missing image: implant selection");
    }
    if (!hasSTLContaining(folderData, "abutment")) {
      errors.push("Missing stl: abutment");
    }
    return errors;
  }

  errors.push("service is not verified");

  return errors;
};
