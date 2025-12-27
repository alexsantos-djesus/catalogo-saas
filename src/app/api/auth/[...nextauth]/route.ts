export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = NextAuth(() => ({
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 🔥 IMPORT DINÂMICO (ESSENCIAL)
        const { prisma } = await import("@/lib/prisma");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
}));

export { handler as GET, handler as POST };
