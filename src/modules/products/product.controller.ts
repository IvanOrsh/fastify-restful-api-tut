import { type FastifyReply, type FastifyRequest } from "fastify";

import { type CreateProductInput } from "./product.schema";
import { createProduct, getProducts } from "./product.service";

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput & { ownerId: number };
  }>,
  reply: FastifyReply
): Promise<void> {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id,
  });

  return await reply.code(201).send(product);
}

export async function getProductsHandler(): Promise<
  Array<{
    title: string;
    content: string | null;
    price: number;
    id: number;
    owner: {
      id: number;
      name: string | null;
    };
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  const products = await getProducts();

  return products;
}
