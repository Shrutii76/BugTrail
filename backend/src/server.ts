import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = Number(process.env.PORT) || 5001;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`BugTrail API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start BugTrail:", error);
    process.exit(1);
  }
}

void startServer();
