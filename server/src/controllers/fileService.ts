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

export const splitCasesByLabToken = async () => {
  try {
    const commonPath = await getSharedPath();
    if (!commonPath) {
      throw new Error("Shared path is null or undefined");
    }

    const folderNames = await getLabTokens(commonPath);
    const verifiedLabTokens = ["JU"];
    const results: Record<string, any> = {};

    // Map each token to its checker function
    const checkerMap: Record<string, (path: string) => Promise<any>> = {
      JU: checkerFunctionForJU,
      // ES: checkerFunctionForES,  if want more just add function and checks and add token in verifiedLabTokens array
    };

    for (const token of folderNames) {
      if (verifiedLabTokens.includes(token) && checkerMap[token]) {
        const folderPath = `${commonPath}/${token}/`;
        const result = await checkerMap[token](folderPath);
        results[token] = result;
      }
    }

    return results;
  } catch (error) {
    console.error(error, "splitCasesByLab");
    return {};
  }
};

export const checkerFunctionForJU = async (location: string) => {
  try {
    const commonCases = await getCasesList(location);
    const data: Record<string, any> = [];
    for (const caseData of commonCases) {
      const pdfData = await extractCaseDetailsFromPDF(
        `${location}/IMPORT/${caseData}`
      );
      const folderData = await getFilesAndFolderNamesInsideCaseFolder(
        `${location}/EXPORT - External/${caseData}`
      );
      data.push(await checkJUCases(pdfData, folderData));
    }
    return data;
  } catch (error) {
    console.error(error, "checkerFunctionForJU");
    return [];
  }
};

export const sendCasesStatus = async (req: Request, res: Response) => {
  try {
    const casesStatus = await splitCasesByLabToken();
    res.json(casesStatus); // send JSON back to Postman
  } catch (error) {
    handleApiError(res, error, "checkCases");
  }
};
