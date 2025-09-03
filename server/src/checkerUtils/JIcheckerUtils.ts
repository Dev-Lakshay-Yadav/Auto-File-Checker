import {
  countFilesExt,
  hasImageContaining
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
export const mainCheckerFunctionJI = async (
  pdfData: PdfData,
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
