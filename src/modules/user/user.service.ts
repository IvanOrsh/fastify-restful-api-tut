import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { type CreateUserInput } from "./user.schema";

export async function createUser(input: CreateUserInput): Promise<{
  id: number;
  email: string;
  name: string | null;
  password: string;
  salt: string;
}> {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      ...rest,
      salt,
      password: hash,
    },
  });

  return user;
}

export async function findUserByEmail(email: string): Promise<{
  id: number;
  email: string;
  name: string | null;
  password: string;
  salt: string;
} | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function findUsers(): Promise<
  Array<{
    id: number;
    email: string;
    name: string | null;
  }>
> {
  return await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}
