import { type FastifyReply, type FastifyRequest } from "fastify";

import { createUser, findUserByEmail, findUsers } from "./user.service";
import {
  type CreateUserInput,
  type LoginInput,
  type LoginResponse,
} from "./user.schema";
import { verifyPassword } from "../../utils/hash";

export async function registerUserHandler(
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

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
): Promise<LoginResponse | undefined> {
  const { email, password } = request.body;

  // find a user by email
  const user = await findUserByEmail(email);

  if (user === null) {
    return await reply.code(401).send({
      message: "Invalid email or password",
    });
  }

  // verity password
  const correctPassword = verifyPassword({
    candidatePassword: password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = user;

    // generate JWT
    return {
      access_token: await reply.jwtSign({
        ...rest,
      }),
    };
  }

  return await reply.code(401).send({
    message: "Invalid email or password",
  });
}

export async function getUsersHandler(): Promise<
  Array<{
    id: number;
    email: string;
    name: string | null;
  }>
> {
  const users = await findUsers();

  return users;
}
