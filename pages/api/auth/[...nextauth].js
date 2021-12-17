import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import connectToDatabase from "../../../helpers/db";
import bcrypt from "bcryptjs";

export default NextAuth({
  session: {
    jwt: true,
  },

  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        // we have to write our own authorization logic

        if (
          !credentials.email ||
          !credentials.email.includes("@") ||
          !credentials.password ||
          credentials.password.trim().length < 8
        ) {
          throw new Error("Please enter correct credentials!");
        }

        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!"); // by default on rejecting the promise due to error, the authorize function redirects the client side user to other page. However, we can override this..
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Incorrect credentials!");
        }

        return {
          email: user.email,
        };
        // that will be encoded in a JSON web token. (custom data)

        client.close();
      },
    }),
  ],
});
