import app from "./app.ts";

const PORT = process.env.PORT || 5000;

const startServer =  async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();