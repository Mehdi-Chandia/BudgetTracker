import NextAuth from "next-auth"
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import {dbConnection} from "@/app/lib/mongodb";
import User from "@/app/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    // FIX 1: Check credentials exist
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password required");
                    }

                    await dbConnection()
                    const user = await User.findOne({
                        email: credentials.email.toLowerCase()
                    })

                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isValid) {
                        throw new Error("Invalid email or password");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        currency: user.currency
                    };
                } catch (error) {
                    console.log("Auth error:", error.message)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.currency = user.currency;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.currency = token.currency;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",  // Use JWT, not database sessions
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,  // Don't forget this!
    debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };