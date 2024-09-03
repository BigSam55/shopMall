import userModel from "@/models/user";
import AdminModel from "@/models/admin";
import connectDb from "@/utils/db";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 40000, 
      },
    }),
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectDb();

          const user = await userModel.findOne({ email });
          const admin = await AdminModel.findOne({ email });

          if (user) {
            const passwordTrue = bcrypt.compareSync(password, user.password);
            if (passwordTrue) {
              return { ...user._doc };
            } else {
              throw new Error("Incorrect Email or Password");
            }
          } else if (admin) {
            const passwordExist = bcrypt.compareSync(password, admin.password);
            if (passwordExist) {
              return { ...admin._doc };
            } else {
              throw new Error("Incorrect Email or Password");
            }
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error(error.message);
          throw new Error("Server error");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;
        try {
          await connectDb();

          const userEmailExists = await userModel.findOne({ email });

          if (!userEmailExists) {
            const res = await fetch("http://localhost:3000/api/Oauth", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email }),
            });

            if (!res.ok) {
              console.error("Error creating user in the database");
              return false;
            }
          }
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
//   debug: true, // Enable debug mode to get more detailed error messages
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
