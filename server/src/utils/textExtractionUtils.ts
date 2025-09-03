// --------------  Basically Extract the case_id -- patient name  -----------------
function extractFilePrefix(text: string): string | null {
  const regex =
    /\b([A-Z0-9]+ -- [A-Za-z0-9 ]+?)\s+(?:Case Priority|Patient name)/i;
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1].replace(/\s+/g, " ").trim();
  }
  return null;
}

// --------------  Basically Extract the Service type data   -----------------
function extractServiceType(
  text: string
): "Crown And Bridge" | "Implant" | "Smile Design" | null {
  // Only consider text before "Tooth Numbers:"
  const cutoffIndex = text.indexOf("Tooth Numbers:");
  const searchText = cutoffIndex !== -1 ? text.substring(0, cutoffIndex) : text;

  const services = ["Crown And Bridge", "Implant", "Smile Design"];

  for (const service of services) {
    const regex = new RegExp(`\\b${service}\\b`, "i"); // case-insensitive
    if (regex.test(searchText)) {
      if (service.toLowerCase() === "crown and bridge")
        return "Crown And Bridge";
      if (service.toLowerCase() === "implant") return "Implant";
      if (service.toLowerCase() === "smile design") return "Smile Design";
    }
  }

  return null;
}

// --------------  Basically Extract the Tooth Numbers data   -----------------
function extractToothNumbers(text: string): number[] {
  // Capture everything after "Tooth Numbers:" until end of line
  const regex = /Tooth Numbers:\s*([0-9,\s]+)/i;
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1]
      .split(/[\s,]+/) // split by space OR comma
      .map((num) => parseInt(num.trim(), 10))
      .filter((num) => !isNaN(num));
  }

  return [];
}

// --------------  Basically Extract the additional notes data   -----------------
function extractAdditionalNotes(text: string): string | null {
  const match = text.match(
    /Additional Notes:\s*([\s\S]*?)(?:\n[A-Z][^\n]*:|\n?$)/i
  );
  return match ? match[1].trim() : null;
}

// ----------------- Main Processor Function utilize above function logics -----------------
export async function processPdfText(text: string) {
  const prefixData: string | null = extractFilePrefix(text);
  const serviceData: string | null = extractServiceType(text);
  const additionalData: string | null = extractAdditionalNotes(text);
  const toothNumbers: number[] | null = extractToothNumbers(text);

  return {
    file_Prefix: prefixData,
    service_Type: serviceData as
      | "Crown And Bridge"
      | "Implant"
      | "Smile Design"
      | null,
    tooth_Numbers: toothNumbers,
    additional_Notes: additionalData,
  };
}
