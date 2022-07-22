import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    redirect: () => "/",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  theme: {
    logo: `${process.env.NEXTAUTH_URL}/assets/default_200_percent/200-error-offline.png`,
    brandColor: "#0f172a",
  },
};

export default NextAuth(authOptions);
