import bcrypt from "bcryptjs";
import { getSession } from "next-auth/client";
import connectToDatabase from "../../../helpers/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return;
  }

  const session = await getSession({ req: req });

  // This is the code with which we protect our API route.
  if (!session) {
    // 401 not authenticated
    res.status(401).json({ message: "Not Authenticated." });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  let client;

  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "Can't connect to the database." });

    return;
  }

  let usersCollection = client.db().collection("users");
  let existingUser = await usersCollection.findOne({ email: userEmail });

  if (!existingUser) {
    client.close();
    res.status(404).json({ message: "User not found!" });

    return;
  }

  const currentPassword = existingUser.password;

  const isValid = await bcrypt.compare(oldPassword, currentPassword);

  if (!isValid) {
    client.close();
    res.status(403).json({ message: "Not authorized!" });

    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    let result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword } }
    );
  } catch (error) {
    client.close();
    res
      .status(500)
      .json({ message: "Something went wrong while updating your details." });
    return;
  }

  client.close();
  res.status(200).json({ message: "Password updated!" });
}

export default handler;
