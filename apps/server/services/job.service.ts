// import { jobCreateData } from "../types";
// import prisma from "../utils/PrismaClient";

// export const jobCreateService = async (
//   data: jobCreateData
// ): Promise<any> => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {

//       },
//     });

//     if (!user) {
//       return {
//         status: 404,
//         data: {
//           message: "User not found",
//         },
//       };
//     }
//     return {
//       status: 200,
//       data: {
//         message: "Login successful",
//       },
//     };
//   } catch (error) {
//     return {
//       status: 500,
//       data: {
//         message: `Internal server error, ${error}`,
//         accessToken: "",
//         refreshToken: "",
//       },
//     };
//   }
// };
