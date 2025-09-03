import {
  countFilesExt,
  hasImageContaining,
  hasSTLContaining,
} from "./commonUtils.js";

// ----------- Interfaces -------------
export interface PdfData {
  file_Prefix: string | null;
  service_Type: "Crown And Bridge" | "Implant" | "Smile Design" | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
}

export type FolderData = string[];

// ----------- Checker Function -------------
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
