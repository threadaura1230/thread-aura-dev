import process from "process";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Load environment variables from .env
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  } else {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const env = fs.readFileSync(envPath, "utf-8");
      env.split("\n").forEach((line: string) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value.trim();
        }
      });
    }
  }
} catch (err) {
  console.warn("Could not load environment variables from .env file:", err);
}

const generateOrderNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TA-${result}`;
};

async function main() {
  try {
    const dbConnect = (await import("../../lib/db")).default;
    const Order = (await import("../../models/Order")).default;

    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("Connected successfully.");

    // Find all orders that don't have an orderNumber
    const ordersToBackfill = await Order.find({
      $or: [
        { orderNumber: { $exists: false } },
        { orderNumber: "" },
        { orderNumber: null }
      ]
    });

    console.log(`Found ${ordersToBackfill.length} orders that need backfilling.`);

    for (const order of ordersToBackfill) {
      let unique = false;
      let newOrderNumber = "";

      while (!unique) {
        newOrderNumber = generateOrderNumber();
        const existing = await Order.findOne({ orderNumber: newOrderNumber });
        if (!existing) {
          unique = true;
        }
      }

      order.orderNumber = newOrderNumber;
      await order.save();
      console.log(`Backfilled order _id: ${order._id} with orderNumber: ${newOrderNumber}`);
    }

    console.log("Backfill completed successfully!");
  } catch (error) {
    console.error("An error occurred during backfill:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();
