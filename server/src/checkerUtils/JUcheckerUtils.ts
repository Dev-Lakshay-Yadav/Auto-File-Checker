import {
  countFilesContaining,
  countFilesExt,
  hasImageContaining,
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
export const mainCheckerFunctionJU = async (
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

  if (pdfData.service_Type === "Crown And Bridge") {
    // Existing checks
    if (!hasImageContaining(folderData, "occlusal contact")) {
      errors.push("Missing image: occlusal contact");
    }
    if (!hasImageContaining(folderData, "proximal contact")) {
      errors.push("Missing image: proximal contact");
    }
    if (!hasImageContaining(folderData, "cement gap")) {
      errors.push("Missing image: cement gap");
    }
    if (
      !(countFilesContaining(folderData, "pic", [".jpg", ".jpeg", ".png"]) >= 3)
    ) {
      errors.push("At least 3 additional pics required");
    }

    // New checks
    const stlPerToothExpected = pdfData.tooth_Numbers?.length || 0;
    const stlFilesFound =
      folderData?.filter(
        (f) =>
          f.toLowerCase().endsWith(".stl") &&
          !f.toLowerCase().includes("preop") &&
          !f.toLowerCase().includes("pre op")
      ).length ?? 0;

    if (stlFilesFound < stlPerToothExpected) {
      errors.push("Missing .stl files for teeth");
    }

    const numTeeth = pdfData.tooth_Numbers?.length || 0;
    if (numTeeth > 3) {
      const files = folderData?.map((f) => f.toLowerCase()) ?? [];
      const preOps = files.filter(
        (f) =>
          (f.includes("preop") || f.includes("pre op")) &&
          (f.endsWith(".stl") ||
            f.endsWith(".jpg") ||
            f.endsWith(".jpeg") ||
            f.endsWith(".png"))
      );

      const hasStl = preOps.some((f) => f.endsWith(".stl"));
      const hasImage = preOps.some(
        (f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png")
      );

      if (!hasStl || !hasImage) {
        errors.push(
          "Pre-op files missing: need at least one .stl and one image (.jpg/.jpeg/.png)"
        );
      }
    }

    return errors;
  }

  if (pdfData.service_Type === "Implant") {
    if (!hasImageContaining(folderData, "implant selection")) {
      errors.push("Missing image: implant selection");
    }
    if (!hasImageContaining(folderData, "hole angulation")) {
      errors.push("Missing image: hole angulation");
    }
    if (!hasImageContaining(folderData, "3 mm hole")) {
      errors.push("Missing image: 3 mm hole");
    }
    if (!hasImageContaining(folderData, "ti base")) {
      errors.push("Missing image: ti base");
    }
    if (!hasImageContaining(folderData, "occlusal contact")) {
      errors.push("Missing image: occlusal contact");
    }
    if (!hasImageContaining(folderData, "proximal contact")) {
      errors.push("Missing image: proximal contact");
    }

    if (
      !(countFilesContaining(folderData, "pic", [".jpg", ".jpeg", ".png"]) >= 4)
    ) {
      errors.push("At least 4 additional pics required");
    }
    if (
      !(
        countFilesExt(folderData, [".stl"]) >= pdfData.tooth_Numbers?.length ||
        0
      )
    ) {
      errors.push("Missing .stl files");
    }

    return errors;
  }

  if (pdfData.service_Type === "Smile Design") {
    if (
      !(countFilesContaining(folderData, "pic", [".jpg", ".jpeg", ".png"]) >= 6)
    ) {
      errors.push("At least 6 additional pics required");
    }
    if (!(countFilesExt(folderData, [".stl"]) >= 2)) {
      errors.push("At least 2 .stl files required");
    }
    return errors;
  }

  errors.push("service is not verified");

  return errors;
};
