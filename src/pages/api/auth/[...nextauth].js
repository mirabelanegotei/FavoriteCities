import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AppDataSource from "../../../../data-source";
import User from "@/pages/entity/User";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const {username,password } = credentials;

      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ username });
      
      if (!user) {
        throw new Error("User not found");
      }
     
      const isValid = await bcrypt.compareSync(password, user.password);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }
      return { id: user.id, username: user.username, email: user.email };
    },
    }),
  ],
  pages: {
    signIn: "/auth/signin", 
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
        let newSession  = {...session};
        if (token?.user) {
            newSession=  {
                ...newSession,
                user: {
                    id: token.user.id,
                    username: token.user.username,
                    email: token.user.email,
                }
            };
            return newSession;
          }
          return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = { id: user.id, username: user.username, email: user.email };
      }
      return token;
    },
  },
});