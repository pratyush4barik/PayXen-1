import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seed() {
  const existingUser = await storage.getUserByUsername("demo");
  if (existingUser) return;

  console.log("Seeding database...");

  const password = await hashPassword("demo123");
  const user = await storage.createUser({
    username: "demo",
    password,
  });

  // Seed Wallet
  await storage.updateWalletBalance(user.id, 5000); // 5000 initial balance
  const wallet = await storage.getWallet(user.id);
  if (wallet) {
    await storage.createTransaction({
      walletId: wallet.id,
      amount: "5000",
      type: "deposit",
      description: "Initial Deposit"
    });
  }

  // Seed Subscriptions
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  await storage.createSubscription({
    userId: user.id,
    name: "Netflix",
    price: 499,
    billingCycle: "monthly",
    startDate: new Date("2024-01-01"),
    nextBillingDate: nextMonth,
    status: "active",
    category: "Entertainment",
    autoCancel: false,
    usageCount: 15,
    lastUsedDate: new Date(),
    logo: "N"
  });

  await storage.createSubscription({
    userId: user.id,
    name: "Spotify",
    price: 119,
    billingCycle: "monthly",
    startDate: new Date("2024-01-15"),
    nextBillingDate: nextMonth,
    status: "active",
    category: "Music",
    autoCancel: true,
    usageCount: 25,
    lastUsedDate: new Date(),
    logo: "S"
  });

  await storage.createSubscription({
    userId: user.id,
    name: "Adobe Creative Cloud",
    price: 1675,
    billingCycle: "monthly",
    startDate: new Date("2024-02-01"),
    nextBillingDate: nextMonth,
    status: "active",
    category: "Productivity",
    autoCancel: true,
    usageCount: 1, // Low usage -> candidate for ghost agent
    lastUsedDate: new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
    logo: "A"
  });

  await storage.createSubscription({
    userId: user.id,
    name: "Amazon Prime",
    price: 1499,
    billingCycle: "yearly",
    startDate: new Date("2023-06-01"),
    nextBillingDate: new Date("2024-06-01"),
    status: "active",
    category: "Shopping",
    autoCancel: false,
    usageCount: 5,
    lastUsedDate: new Date(),
    logo: "P"
  });

  console.log("Seeding complete. User: demo / demo123");
}
