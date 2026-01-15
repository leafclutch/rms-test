import "dotenv/config";
import app from "./app.js";
import { connectToDB } from "./config/prisma.ts";
const PORT = process.env.PORT ;

const startServer =  async () => {

  await connectToDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Keep process alive
  setInterval(() => {}, 1000 * 60 * 60);
}

startServer();