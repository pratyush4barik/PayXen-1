import { useState } from "react";
import { Layout } from "@/components/layout";
import { useWallet, useTransactions, useDeposit } from "@/hooks/use-wallet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";

export default function WalletPage() {
  const { data: wallet } = useWallet();
  const { data: transactions } = useTransactions();
  const deposit = useDeposit();
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    deposit.mutate(parseFloat(amount), {
      onSuccess: () => {
        setOpen(false);
        setAmount("");
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your funds and transactions</p>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-indigo-100 font-medium mb-1 flex items-center gap-2">
                <WalletIcon className="w-4 h-4" /> Total Balance
              </p>
              <h2 className="text-5xl font-bold text-white font-mono tracking-tight">
                ${Number(wallet?.balance || 0).toFixed(2)}
              </h2>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg border-0">
                  <ArrowDownLeft className="w-5 h-5 mr-2" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDeposit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        min="1" 
                        step="0.01" 
                        placeholder="0.00"
                        className="pl-8 text-lg"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={deposit.isPending}>
                    {deposit.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Confirm Deposit
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Transactions */}
        <Card className="bg-card border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions?.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/30 transition-colors border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{tx.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold font-mono ${tx.type === 'deposit' ? 'text-green-500' : 'text-foreground'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {(!transactions || transactions.length === 0) && (
                <div className="py-12 text-center text-muted-foreground">
                  No transactions found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
