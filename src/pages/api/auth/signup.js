import AppDataSource from "../../../../data-source"; 
import User from "@/pages/entity/User";  
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      const userRepository = AppDataSource.getRepository(User);

      const existingUserByUsername = await userRepository.findOne({ where: { username } });
      const existingUserByEmail = await userRepository.findOne({ where: { email } });
      if (existingUserByUsername) {
        return res.status(400).json({ 
          error: "The username you have entered is already associated with an existing account. Please choose a different username." 
        });
      }
      if (existingUserByEmail) {
        return res.status(400).json({ 
          error: "The email address is already associated with an existing account. Please use a different email address." 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username: username,
        email: email,
        password: hashedPassword,
      };

      const userCreated = userRepository.create(newUser);
      await userRepository.save(userCreated);

      return res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      console.error("Error inserting user:", error);
      return res.status(500).json({ error: "Failed to register user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}