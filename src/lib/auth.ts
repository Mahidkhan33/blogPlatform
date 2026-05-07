import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectToDatabase from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isPasswordValid) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          bio: user.bio,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
});
