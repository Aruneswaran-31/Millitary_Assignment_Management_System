import app from "./app";
import { prisma } from "./db";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
  try {
    await prisma.$connect();
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection error", err);
  }
});
