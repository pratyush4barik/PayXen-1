import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Wallet, Transaction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useWallet() {
  return useQuery<Wallet>({
    queryKey: [api.wallet.get.path],
    queryFn: async () => {
      const res = await fetch(api.wallet.get.path);
      if (!res.ok) throw new Error("Failed to fetch wallet");
      return await res.json();
    },
  });
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: [api.wallet.transactions.path],
    queryFn: async () => {
      const res = await fetch(api.wallet.transactions.path);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return await res.json();
    },
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(api.wallet.deposit.path, {
        method: api.wallet.deposit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Deposit failed");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wallet.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.wallet.transactions.path] });
      toast({ title: "Deposit Successful", description: "Funds added to your wallet." });
    },
    onError: () => {
      toast({ title: "Deposit Failed", description: "Could not process transaction.", variant: "destructive" });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch(api.wallet.withdraw.path, {
        method: api.wallet.withdraw.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Withdrawal failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wallet.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.wallet.transactions.path] });
      toast({ title: "Withdrawal Successful", description: "Funds removed from your wallet." });
    },
    onError: (error: Error) => {
      toast({ title: "Withdrawal Failed", description: error.message, variant: "destructive" });
    },
  });
}
