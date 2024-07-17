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
                    username,
                    fullname,
                    token,
                } = credentials as {
                    id: string
                    username: string,
                    fullname: string
                    token: string
                };

                if (token || username) {
                    return {
                        id: id as string,
                        username: username,
                        fullname: fullname,
                        token: token
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
