export type FolderData = string[];

export interface PdfData {
  file_Prefix: string | null;
  service_Type:
    | "Crown And Bridge"
    | "Implant"
    | "Smile Design"
    | "Digital Model"
    | "Surgical Guide"
    | "Nightguard"
    | "Other Treatments"
    | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
}

export interface Result {
  success: boolean;
  file_Prefix: string;
  service_Type:
    | "Crown And Bridge"
    | "Implant"
    | "Smile Design"
    | "Digital Model"
    | "Surgical Guide"
    | "Nightguard"
    | "Other Treatments"
    | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
  error: string[];
}
