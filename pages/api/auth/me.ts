import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function Me(req: NextApiRequest, res: NextApiResponse) {
  const bearerToken = req.headers["authorization"] as string;

  const token = bearerToken.split(" ")[1];

  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) {
    res.status(401).json({ errorMessage: "Unauthorized Request" });
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  if (!user) {
    return res.status(401).json({ errorMessage: "User not found" });
  }

  res.json({
    id: user.id,
    firstName: user?.first_name,
    lastName: user?.last_name,
    city: user?.city,
    phone: user?.phone,
  });
}
