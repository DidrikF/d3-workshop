// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession, User } from "next-auth";
import { decode, getToken } from "next-auth/jwt";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

import { prisma } from "../db/client";

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  const req = opts?.req;
  const res = opts?.res;

  const jwt = req && (await getToken({ req }));

  const user: User | null | undefined = jwt && {
    id: jwt.sub!,
    email: jwt.email,
    name: jwt.name,
    image: jwt.picture,
  };

  return {
    req,
    res,
    prisma,
    user,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
