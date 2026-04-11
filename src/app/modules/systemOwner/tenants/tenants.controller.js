import { StatusCodes } from "http-status-codes";
import { TenantsService } from "./tenants.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const handleError = (res, error) => {
  console.error("Tenants Error:", error);
  if (error instanceof DevBuildError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "An internal server error occurred",
  });
};

const getAllTenants = async (req, res) => {
  try {
    const result = await TenantsService.getAllTenantsFromDB();
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Tenants fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const TenantsController = {
  getAllTenants,
};
