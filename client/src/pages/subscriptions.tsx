import { Layout } from "@/components/layout";
import { useSubscriptions, useDeleteSubscription } from "@/hooks/use-subscriptions";
import { AddSubscriptionDialog } from "@/components/add-subscription-dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, CreditCard, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Subscriptions() {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const deleteSub = useDeleteSubscription();

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Subscriptions</h1>
          <p className="text-muted-foreground mt-1">Manage your recurring payments</p>
        </div>
        <AddSubscriptionDialog />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : subscriptions?.length === 0 ? (
        <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
          <h3 className="text-xl font-bold mb-2">No subscriptions yet</h3>
          <p className="text-muted-foreground mb-6">Add your first subscription to start tracking.</p>
          <AddSubscriptionDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions?.map((sub) => (
            <Card key={sub.id} className="relative group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-fuchsia-500" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl font-bold font-display text-foreground">
                    {sub.name.charAt(0)}
                  </div>
                  <Badge variant={sub.status === 'active' ? 'default' : 'secondary'} className={sub.status === 'active' ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}>
                    {sub.status}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{sub.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{sub.category}</p>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-2xl font-bold font-mono">${Number(sub.price).toFixed(2)}</span>
                  <span className="text-muted-foreground ml-1">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                    Next: {format(new Date(sub.nextBillingDate), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CreditCard className="w-4 h-4 mr-2 opacity-70" />
                    Auto-cancel: {sub.autoCancel ? "On" : "Off"}
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteSub.mutate(sub.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
