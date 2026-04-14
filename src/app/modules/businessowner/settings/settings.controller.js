import { StatusCodes } from "http-status-codes";
import { SettingsService } from "./settings.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const handleError = (res, error) => {
  console.error("Settings Error:", error);
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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const normalizedBody = {};
    for (const key in req.body) {
      normalizedBody[key.trim()] = req.body[key];
    }

    const { first_name, last_name } = normalizedBody;
    const updateData = {};

    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;

    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      throw new DevBuildError(
        "No data provided to update",
        StatusCodes.BAD_REQUEST,
      );
    }

    const result = await SettingsService.updateProfileInDB(userId, updateData);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await SettingsService.getProfileFromDB(userId);

    if (!result) {
      throw new DevBuildError("User profile not found", StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const SettingsController = {
  updateProfile,
  getProfile,
};
