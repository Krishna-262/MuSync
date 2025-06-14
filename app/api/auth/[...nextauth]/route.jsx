import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",

  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      session.user.id = token.id;
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });
    
        if (existingUser) {
          token.id = existingUser.id;
        } else {
          // fallback: token.sub is usually set by Google
          token.id = token.sub;
        }
      }
      return token;
    },
    
    async redirect({ url, baseUrl }) {
      // Only allow relative or same-origin URLs
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },

    async signIn({ user }) {
      if (!user.email) return false;
      try {
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prismaClient.user.create({
            data: {
              email: user.email,
              provider: "Google",
            },
          });
          console.log("✅ User created");
        }
        return true;
      } catch (e) {
        console.error("❌ Prisma error in signIn callback:", e);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
