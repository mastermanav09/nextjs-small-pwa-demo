import connectToDatabase from "../../../helpers/db";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  if (
    !userEmail ||
    !userEmail.includes("@") ||
    !userPassword ||
    userPassword.trim().length < 8
  ) {
    res.status(422).json({
      message:
        "Invalid input - password should also be at least 8 characters long.",
    });

    return;
  }

  let client;
  try {
    client = await connectToDatabase();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't connect to the database!",
    });
    return;
  }

  const db = client.db();

  let existingEmail;

  try {
    existingEmail = await db.collection("users").findOne({ email: userEmail });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
    client.close();
    return;
  }

  if (existingEmail) {
    res.status(422).json({
      message: "Email already exists!",
    });
    client.close();
    return;
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(userPassword, 12);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong with the inputs.",
    });
    client.close();
    return;
  }

  try {
    await db.collection("users").insertOne({
      email: userEmail,
      password: hashedPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Creating account failed!",
    });
    client.close();
    return;
  }

  res.status(201).json({
    message: "Created account successfully!",
  });

  client.close();
};

export default handler;
