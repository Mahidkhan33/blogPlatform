import type { NextAuthConfig } from "next-auth";
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.image = user.image;
        token.name = user.name;
        token.bio = (user as any).bio;
      }
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.image = session.image || token.image;
        token.bio = session.bio || token.bio;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
        (session.user as any).bio = token.bio as string;
      }
      return session;
    },
  },
  providers: [],
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
