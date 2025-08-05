import { Server } from "http";
import app from "./app";
import { envVars } from "./app/configs/env.config";
import mongoose from "mongoose";
import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;

const run = async () => {
  try {
    await mongoose.connect(envVars.DB_URI);
    console.log("Connected to mongoDB.");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running at PORT: ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await run();
  await seedAdmin();
})();

process.on("SIGTERM", () => {
  console.log("Signal termination detected... server is shuting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("sigint detected... server is shuting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log(
    "unhandeled rejection error:",
    error,
    "-> server is shuting down.."
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("uncatch exption error:", error, "-> server is shuting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
