import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service.js";
import prisma from "../../../prisma/client.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const login = async (req, res) => {
  try {
    const result = await AuthService.login(prisma, req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login Error:", error);

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
  }
};

export const AuthController = {
  login,
};
