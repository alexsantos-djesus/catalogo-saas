const { prisma } = await import("@/lib/prisma");
import { getSessionUser } from "@/lib/get-session-user";

export async function getStoreBySlug(slug: string) {
  const user = await getSessionUser();
  if (!user) return null;

  const store = await prisma.store.findFirst({
    where: {
      slug,
      owner: {
        email: user.email,
      },
    },
  });

  return store;
}
