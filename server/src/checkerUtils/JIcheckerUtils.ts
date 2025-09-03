import { countFilesExt, hasImageContaining } from "./commonUtils.js";

import { PdfDataJI, FolderData } from "../types/commonTypes.js";

export const mainCheckerFunctionJI = async (
  pdfData: PdfDataJI,
  folderData: FolderData
): Promise<string[]> => {
  const errors: string[] = [];

  if (!(countFilesExt(folderData, [".zip"]) > 0)) {
    errors.push("Missing .zip file");
  }
  if (!(countFilesExt(folderData, [".stl"]) > 0)) {
    errors.push("Missing .stl file");
  }
  if (!hasImageContaining(folderData, "occlusal contact")) {
    errors.push("Missing image: occlusal contact");
  }
  if (!hasImageContaining(folderData, "proximal contact")) {
    errors.push("Missing image: proximal contact");
  }

  return errors;
};
