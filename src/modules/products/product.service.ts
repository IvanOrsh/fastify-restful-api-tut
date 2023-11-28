import prisma from "../../utils/prisma";
import { type CreateProductInput } from "./product.schema";

export async function createProduct(
  data: CreateProductInput & { ownerId: number }
): Promise<{
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string | null;
  price: number;
  ownerId: number;
}> {
  // infer ownerId from jwt

  return await prisma.product.create({
    data,
  });
}

export async function getProducts(): Promise<
  Array<{
    title: string;
    content: string | null;
    price: number;
    id: number;
    owner: {
      id: number;
      name: string | null;
    };
  }>
> {
  return await prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
