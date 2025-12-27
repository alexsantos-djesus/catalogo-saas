import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export async function getSessionUser() {
  const token = await getToken({
    req: { cookies },
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.email) return null;

  return {
    email: token.email as string,
    name: token.name as string | undefined,
  };
}
