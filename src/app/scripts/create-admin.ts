import process from "process";
import readline from "readline";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Load environment variables from .env
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  } else {
    // Basic fallback parsing for older Node.js versions
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  try {
    // Dynamically import database and model files AFTER environment variable loading
    const dbConnect = (await import("../../lib/db")).default;
    const Admin = (await import("../../models/admin/Admin")).default;

    // 1. Get CLI arguments or prompt user
    let username = process.argv[2];
    let password = process.argv[3];
    let role = process.argv[4] || "admin";
    let email = process.argv[5];

    if (!username || !password) {
      console.log("\n=== Create Admin User ===");
      username = await question("Enter username: ");
      password = await question("Enter password: ");
      const roleInput = await question("Enter role (admin/superadmin) [admin]: ");
      if (roleInput.trim()) {
        role = roleInput.trim();
      }
    }

    if (!username.trim() || !password.trim()) {
      console.error("Error: Username and password are required.");
      process.exit(1);
    }

    if (!email) {
      email = await question("Enter email: ");
    }

    if (!email.trim()) {
      console.error("Error: Email is required.");
      process.exit(1);
    }

    // Validate role
    if (role !== "superadmin") {
      console.error("Error: Role must be 'superadmin'.");
      process.exit(1);
    }

    console.log(`Connecting to MongoDB...`);
    await dbConnect();
    console.log("Connected successfully.");

    // 2. Check if user already exists
    const existingAdmin = await Admin.findOne({ username: username.trim() });
    if (existingAdmin) {
      console.error(`Error: Admin user with username '${username}' already exists.`);
      process.exit(1);
    }

    // Check if email already exists
    const existingEmail = await Admin.findOne({ email: email.trim() });
    if (existingEmail) {
      console.error(`Error: Admin user with email '${email}' already exists.`);
      process.exit(1);
    }

    // 3. Create and save new admin
    const newAdmin = new Admin({
      username: username.trim(),
      password: password.trim(),
      role: role,
      email: email.trim(),
    });

    await newAdmin.save();
    console.log(`\n✨ Success: Admin user '${username}' created with role '${role}' and email '${email.trim()}'!`);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();
