import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function p2pTransfer(to: string, amount: number) {

    const session = await getServerSession(authOptions);
    const from = session?.user?.id;

    if (!from) {
        return {
            message: "Error while sending"
        }
    }

    const toUser = await prisma.user.findFirst({
        where: { number: to }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }

    await prisma.$transaction(async (tnx) => {
        await tnx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`;

        const fromBalance = await tnx.balance.findUnique({
            where: { userId: Number(from) }
        });

        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error("Insufficient funds");
        }

        await tnx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } }
        });

        await tnx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } }
        });

        await tnx.p2pTransfer.create({
            data: {
                fromUserId: Number(from),
                toUserId: toUser?.id,
                amount,
                timestamp: new Date()
            }
        })
    });

}

