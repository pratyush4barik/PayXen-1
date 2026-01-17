import { db } from "./db";
import { 
  users, wallets, transactions, subscriptions, groups, groupMembers,
  type User, type InsertUser, type Wallet, type Transaction, 
  type Subscription, type InsertSubscription, type Group, type GroupMember 
} from "@shared/schema";
import { eq, and, lte } from "drizzle-orm";

export interface IStorage {
  // User & Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Wallet
  getWallet(userId: number): Promise<Wallet | undefined>;
  createWallet(userId: number): Promise<Wallet>;
  updateWalletBalance(userId: number, amount: number): Promise<Wallet>; // amount can be negative
  createTransaction(transaction: any): Promise<Transaction>;
  getTransactions(walletId: number): Promise<Transaction[]>;

  // Subscriptions
  getSubscriptions(userId: number): Promise<Subscription[]>;
  getSubscription(id: number): Promise<Subscription | undefined>;
  createSubscription(sub: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, updates: Partial<InsertSubscription>): Promise<Subscription>;
  deleteSubscription(id: number): Promise<void>;
  
  // Groups
  getGroups(userId: number): Promise<Group[]>;
  createGroup(group: any, memberIds: number[]): Promise<Group>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    // Auto create wallet
    await this.createWallet(user.id);
    return user;
  }

  async getWallet(userId: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async createWallet(userId: number): Promise<Wallet> {
    const [wallet] = await db.insert(wallets).values({ userId, balance: "0" }).returning();
    return wallet;
  }

  async updateWalletBalance(userId: number, amount: number): Promise<Wallet> {
    const wallet = await this.getWallet(userId);
    if (!wallet) throw new Error("Wallet not found");
    
    const newBalance = Number(wallet.balance) + amount;
    const [updated] = await db.update(wallets)
      .set({ balance: newBalance.toString() })
      .where(eq(wallets.id, wallet.id))
      .returning();
    return updated;
  }

  async createTransaction(data: any): Promise<Transaction> {
    const [tx] = await db.insert(transactions).values(data).returning();
    return tx;
  }

  async getTransactions(walletId: number): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.walletId, walletId));
  }

  async getSubscriptions(userId: number): Promise<Subscription[]> {
    return db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
  }

  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return sub;
  }

  async createSubscription(sub: InsertSubscription): Promise<Subscription> {
    const [newSub] = await db.insert(subscriptions).values(sub).returning();
    return newSub;
  }

  async updateSubscription(id: number, updates: Partial<InsertSubscription>): Promise<Subscription> {
    const [updated] = await db.update(subscriptions)
      .set(updates)
      .where(eq(subscriptions.id, id))
      .returning();
    return updated;
  }

  async deleteSubscription(id: number): Promise<void> {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
  }

  async getGroups(userId: number): Promise<Group[]> {
    // Simplified group fetching for prototype
    const memberships = await db.select().from(groupMembers).where(eq(groupMembers.userId, userId));
    const groupIds = memberships.map(m => m.groupId);
    if (groupIds.length === 0) return [];
    
    // In a real app we'd use `inArray` but manual loop is fine for lite
    const result = [];
    for (const gid of groupIds) {
      const [g] = await db.select().from(groups).where(eq(groups.id, gid));
      if (g) result.push(g);
    }
    return result;
  }

  async createGroup(groupData: any, members: { userId: number, splitPercentage: number }[]): Promise<Group> {
    const [group] = await db.insert(groups).values(groupData).returning();
    
    // Add creator with their split
    // Find creator split from members or default
    const creatorMember = members.find(m => m.userId === group.creatorId);
    const creatorSplit = creatorMember ? creatorMember.splitPercentage : 100;

    await db.insert(groupMembers).values({
      groupId: group.id,
      userId: group.creatorId,
      splitPercentage: creatorSplit.toString()
    });

    // Add other members
    for (const m of members) {
      if (m.userId === group.creatorId) continue;
      await db.insert(groupMembers).values({
        groupId: group.id,
        userId: m.userId,
        splitPercentage: m.splitPercentage.toString()
      });
    }
    
    return group;
  }

  async removeGroupMember(groupId: number, userId: number): Promise<void> {
    await db.delete(groupMembers).where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId)
      )
    );
  }
}

export const storage = new DatabaseStorage();
