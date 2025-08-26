import { Request, Response } from "express";
import { handleApiError } from "../utils/errorHandlers.js";
import {
  getCasesList,
  getLabTokens,
  getSharedPath,
} from "../utils/fileUtils.js";

export const splitCasesByLabToken = async (commonPath: string) => {
  try {
    const folderNames = await getLabTokens(commonPath);
    const verifiedLabTokens = ["JU", "CK", "ES"];

    for (const token of folderNames) {
      if (verifiedLabTokens.includes(token)) {
        switch (token) {
          case "JU":
            await checkerFunctionForJU(`${commonPath}/JU/`);
            console.log("JU");
            break;
          default:
            console.log("unknown error occur");
        }
      }
    }
  } catch (error) {
    console.log(error, "splitCasesByLab");
  }
};

// Route handler
export const checkCases = async (req: Request, res: Response) => {
  try {
    const commonPath = await getSharedPath();

    if (!commonPath) {
      return res.status(404).json({ message: "Shared path not found" });
    }

    await splitCasesByLabToken(commonPath);

    res.json({ folders: "hii" });
  } catch (error) {
    handleApiError(res, error, "checkCases");
  }
};

export const checkerFunctionForJU = async (location: string) => {
  try {
    const commonCases = await getCasesList(location);
    return commonCases;
  } catch (error) {
    console.error(error, "checkerFunctionForJU");
    return []; 
  }
};
