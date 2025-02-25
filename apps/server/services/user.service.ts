import { decodeToken } from "../utils/decodeToken";
import prisma from "../utils/PrismaClient";

export const getUserService = async (
  userId: string
): Promise<{
  status: number;
  data: { message: string; user?: any };
}> => {
  const id = decodeToken(userId);
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return {
      status: 404,
      data: { message: "User not found" },
    };
  }
  return {
    status: 200,
    data: { message: "User found", user },
  };
};

export const getPublicUserService = async (
  email: string
): Promise<{
  status: number;
  data: { message: string; user?: any };
}> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return {
      status: 404,
      data: { message: "User not found" },
    };
  }
  return {
    status: 200,
    data: { message: "User found", user },
  };
};
