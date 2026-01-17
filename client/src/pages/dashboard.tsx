import { useWallet, useTransactions } from "@/hooks/use-wallet";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useRunAgent } from "@/hooks/use-agent";
import { StatCard } from "@/components/stat-card";
import { Layout } from "@/components/layout";
import { 
  CreditCard, 
  Wallet as WalletIcon, 
  Activity, 
  Ghost,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { data: wallet } = useWallet();
  const { data: transactions } = useTransactions();
  const { data: subscriptions } = useSubscriptions();
  const runAgent = useRunAgent();

  const totalMonthlyExpenses = subscriptions?.reduce((acc, sub) => {
    return sub.status === 'active' ? acc + Number(sub.price) : acc;
  }, 0) || 0;

  const activeSubs = subscriptions?.filter(s => s.status === 'active').length || 0;

  // Mock data for charts if no real history
  const chartData = [
    { name: 'Jan', amount: 240 },
    { name: 'Feb', amount: 139 },
    { name: 'Mar', amount: 980 },
    { name: 'Apr', amount: 390 },
    { name: 'May', amount: 480 },
    { name: 'Jun', amount: 380 },
    { name: 'Jul', amount: 430 },
  ];

  const COLORS = ['#8b5cf6', '#d946ef', '#06b6d4', '#10b981'];
  
  const categoryData = [
    { name: 'Entertainment', value: 400 },
    { name: 'Software', value: 300 },
    { name: 'Utilities', value: 300 },
    { name: 'Work', value: 200 },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your financial health</p>
        </div>
        <Button 
          onClick={() => runAgent.mutate()}
          disabled={runAgent.isPending}
          className="bg-secondary hover:bg-secondary/80 text-foreground border border-white/10 shadow-lg"
        >
          <Ghost className={`w-4 h-4 mr-2 ${runAgent.isPending ? "animate-pulse" : ""}`} />
          {runAgent.isPending ? "Ghost Agent Working..." : "Run Ghost Agent"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Balance" 
          value={`$${Number(wallet?.balance || 0).toFixed(2)}`} 
          icon={WalletIcon} 
          trend="12%" 
          trendUp={true}
          color="primary"
        />
        <StatCard 
          title="Monthly Expenses" 
          value={`$${totalMonthlyExpenses.toFixed(2)}`} 
          icon={CreditCard} 
          trend="5%" 
          trendUp={false}
          color="accent"
        />
        <StatCard 
          title="Active Subs" 
          value={activeSubs} 
          icon={Activity} 
          color="default"
        />
        <StatCard 
          title="Total Saved" 
          value="$124.50" 
          icon={Ghost} 
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Spending History</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display">Recent Activity</h2>
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-lg">
          {transactions?.slice(0, 5).map((tx, i) => (
            <div key={tx.id} className={`flex items-center justify-between p-4 ${i !== transactions.length - 1 ? 'border-b border-border/40' : ''} hover:bg-white/5 transition-colors`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{new Date(tx.createdAt!).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-bold font-mono ${tx.type === 'deposit' ? 'text-green-500' : 'text-foreground'}`}>
                {tx.type === 'deposit' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
          {(!transactions || transactions.length === 0) && (
            <div className="p-8 text-center text-muted-foreground">
              No recent transactions
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
