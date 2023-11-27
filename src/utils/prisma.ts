// TODO: isn't this an anti pattern?

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
