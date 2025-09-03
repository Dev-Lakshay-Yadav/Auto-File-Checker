import {
  countFilesExt,
  hasImageContaining,
  hasSTLContaining,
} from "./commonUtils.js";

import { PdfData, FolderData } from "../types/commonTypes.js";

export const mainCheckerFunctionLZ = async (
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
  if (!hasSTLContaining(folderData, "model")) {
    errors.push("Missing stl: model");
  }
  if (!hasImageContaining(folderData, "heat map")) {
    errors.push("Missing image: heat map");
  }
  errors.push("service is not verified");

  return errors;
};
