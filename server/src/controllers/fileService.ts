import { Request, Response } from "express";
import { handleApiError } from "../utils/errorHandlers.js";
import {
  getCasesList,
  getLabTokens,
  getSharedPath,
} from "../utils/fileUtils.js";
import { extractCaseDetailsFromPDF } from "../services/pdfToText.js";
import { getFilesAndFolderNamesInsideCaseFolder } from "../services/folderFiles.js";

import { checkJUCases } from "../checkerFunctions/JU.js";
import { checkJICases } from "../checkerFunctions/JI.js";
import { checkLZCases } from "../checkerFunctions/LZ.js";
import { checkSACases } from "../checkerFunctions/SA.js";

type CheckerFn = (pdfData: any, folderData: any) => Promise<any>;

// Generic processor for lab cases
export const processLabCases = async (
  location: string,
  checkerFn: CheckerFn
) => {
  try {
    const commonCases = await getCasesList(location);
    const results: any[] = [];

    for (const caseData of commonCases) {
      const pdfPath = `${location}/IMPORT/${caseData}`;
      const folderPath = `${location}/EXPORT - External/${caseData}`;

      const pdfData = await extractCaseDetailsFromPDF(pdfPath);
      const folderData = await getFilesAndFolderNamesInsideCaseFolder(
        folderPath
      );

      results.push(await checkerFn(pdfData, folderData));
    }

    return results;
  } catch (error) {
    console.error(error, "processLabCases");
    return [];
  }
};

// Splits cases by lab token and runs the appropriate checker
export const splitCasesByLabToken = async () => {
  try {
    const commonPath = await getSharedPath();
    if (!commonPath) {
      throw new Error("Shared path is null or undefined");
    }

    const folderNames = await getLabTokens(commonPath);
    const verifiedLabTokens = ["JU", "SA", "JI", "LZ"];
    const results: Record<string, any> = {};

    // Map each token directly to its checker function
    const checkerMap: Record<string, (path: string) => Promise<any>> = {
      JU: (location) => processLabCases(location, checkJUCases),
      SA: (location) => processLabCases(location, checkSACases),
      JI: (location) => processLabCases(location, checkJICases),
      LZ: (location) => processLabCases(location, checkLZCases),
    };

    for (const token of folderNames) {
      if (verifiedLabTokens.includes(token) && checkerMap[token]) {
        const folderPath = `${commonPath}/${token}/`;
        results[token] = await checkerMap[token](folderPath);
      }
    }

    return results;
  } catch (error) {
    console.error(error, "splitCasesByLab");
    return {};
  }
};

// Express controller to send case status
export const sendCasesStatus = async (req: Request, res: Response) => {
  try {
    const casesStatus = await splitCasesByLabToken();
    res.json(casesStatus);
  } catch (error) {
    handleApiError(res, error, "checkCases");
  }
};
