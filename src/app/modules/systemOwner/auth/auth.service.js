import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import DevBuildError from "../../../lib/DevBuildError.js";
import { createUserTokens } from "../../../utils/userTokenGenerator.js";

const login = async (prisma, payload) => {
  const { email, password } = payload;

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new DevBuildError("User does not exist", StatusCodes.NOT_FOUND);
  }

  if (user.role !== "SYSTEM_OWNER") {
    throw new DevBuildError("You are not authorized", StatusCodes.UNAUTHORIZED);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new DevBuildError("Incorrect password", StatusCodes.UNAUTHORIZED);
  }

  const tokens = createUserTokens(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    },
    ...tokens,
  };
};

export const AuthService = {
  login,
};
