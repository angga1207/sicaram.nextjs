import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {},
            authorize(credentials, req) {
                const {
                    id,
                    name,
                } = credentials as {
                    id: string
                    name: string,
                };

                if (name) {
                    return {
                        id: id as string,
                        name: name as string,
                    }
                }
                // throw new Error("No credentials");
                return null;
            },
        })
    ],

    pages: {
        signIn: "/login",
        // signOut: "/logout",
    },
};
export default NextAuth(authOptions);
