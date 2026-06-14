import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export type AppRole = Role;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        return valid
          ? {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.image,
            }
          : null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      const typedToken = token as typeof token & { role?: Role; id?: string };
      if (user) {
        typedToken.role = user.role as Role;
        typedToken.id = user.id;
      }
      return typedToken;
    },
    session({ session, token }) {
      const typedToken = token as typeof token & { role?: Role; id?: string };
      if (session.user) {
        session.user.role = typedToken.role ?? "BUYER";
        session.user.id = typedToken.id as string;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
});
