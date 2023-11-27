import { type FastifyReply, type FastifyRequest } from "fastify";
import { createUser } from "./user.service";
import { type CreateUserInput } from "./user.schema";

async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
): Promise<void> {
  const body = request.body;

  try {
    const user = await createUser(body);

    return await reply.code(201).send(user);
  } catch (e) {
    // TODO: better error handling, not just logging
    console.log(e);
    return await reply.code(500).send(e);
  }
}

export default registerUserHandler;
