import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInputSchema = {
  title: z.string().max(255),
  content: z.string().optional(),
  price: z.number().min(0),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z.object({
  ...productInputSchema,
});
const productResponseSchema = z.object({
  ...productInputSchema,
  ...productGenerated,
});

const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas({
  createProductSchema,
  productResponseSchema,
  productsResponseSchema,
});
