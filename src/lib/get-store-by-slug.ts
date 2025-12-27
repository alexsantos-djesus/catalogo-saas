import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getStoreBySlug(slug: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const store = await prisma.store.findFirst({
    where: {
      slug,
      owner: {
        email: session.user.email,
      },
    },
  });

  return store;
}
