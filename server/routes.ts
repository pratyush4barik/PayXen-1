import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertSubscriptionSchema } from "@shared/schema";
import { seed } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);
  
  // Seed Data
  seed().catch(console.error);

  // === Wallet ===
  app.get(api.wallet.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const wallet = await storage.getWallet(req.user.id);
    res.json(wallet);
  });

  app.post(api.wallet.deposit.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { amount } = api.wallet.deposit.input.parse(req.body);
    
    const wallet = await storage.updateWalletBalance(req.user.id, amount);
    await storage.createTransaction({
      walletId: wallet.id,
      amount: amount.toString(),
      type: "deposit",
      description: "Wallet Top-up"
    });
    
    res.json(wallet);
  });

  app.get(api.wallet.transactions.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const wallet = await storage.getWallet(req.user.id);
    if (!wallet) return res.sendStatus(404);
    const txs = await storage.getTransactions(wallet.id);
    res.json(txs);
  });

  // === Subscriptions ===
  app.get(api.subscriptions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const subs = await storage.getSubscriptions(req.user.id);
    res.json(subs);
  });

  app.post(api.subscriptions.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Force numbers for decimal fields if they come as strings
    const body = { ...req.body, userId: req.user.id };
    if (typeof body.price === 'string') body.price = parseFloat(body.price);
    
    const sub = await storage.createSubscription(body);
    res.status(201).json(sub);
  });

  app.put(api.subscriptions.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    const updated = await storage.updateSubscription(id, req.body);
    res.json(updated);
  });

  app.delete(api.subscriptions.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteSubscription(parseInt(req.params.id));
    res.sendStatus(200);
  });

  // === Ghost Agent ===
  app.post(api.agent.run.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const subs = await storage.getSubscriptions(req.user.id);
    const wallet = await storage.getWallet(req.user.id);
    
    let processed = 0;
    let cancelled = 0;
    const logs: string[] = [];
    
    if (!wallet) return res.status(404).send("No wallet");

    for (const sub of subs) {
      if (sub.status !== 'active') continue;
      processed++;
      
      let shouldCancel = false;
      let reason = "";

      // Rule 1: Usage count low
      if (sub.usageCount !== null && sub.usageCount <= 1) {
        shouldCancel = true;
        reason = `Low usage detected (${sub.usageCount} times/month)`;
      }

      // Rule 2: Wallet insufficient (Simulated check against a threshold or price)
      if (parseFloat(wallet.balance) < parseFloat(sub.price)) {
        shouldCancel = true;
        reason = `Insufficient wallet balance (₹${wallet.balance})`;
      }

      if (shouldCancel && sub.autoCancel) {
        await storage.updateSubscription(sub.id, { status: 'cancelled' });
        cancelled++;
        logs.push(`Cancelled ${sub.name}: ${reason}`);
        
        // Mock Refund Logic: Refund 50% if cancelled via agent
        const refundAmount = parseFloat(sub.price) * 0.5;
        await storage.updateWalletBalance(req.user.id, refundAmount);
        await storage.createTransaction({
          walletId: wallet.id,
          amount: refundAmount.toString(),
          type: "refund",
          description: `Ghost Agent Refund for ${sub.name}`
        });
      }
    }

    res.json({ processed, cancelled, logs });
  });

  // === Groups ===
  app.get(api.groups.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const groups = await storage.getGroups(req.user.id);
    res.json(groups);
  });

  return httpServer;
}
