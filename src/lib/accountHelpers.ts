import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";

export const authenticateAdmin = async () => {
    const session = await getAuthSession();

    if (!session?.user) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user?.isAdmin) {
        return false;
    }

    return user;
};
