import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { useGroups, useCreateGroup, useDeleteMember } from "@/hooks/use-groups";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, UserPlus, Wallet, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function GroupsPage() {
  const { data: groups, isLoading } = useGroups();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <Layout>
         <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
         <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map(i => <div key={i} className="h-64 bg-card rounded-2xl animate-pulse" />)}
         </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Group Wallets</h1>
          <p className="text-muted-foreground mt-1">Split subscription costs with friends and family.</p>
        </div>
        <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}

        {groups?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-muted/10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-display">No Groups Yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Create a group wallet to track shared subscriptions like Netflix Family, Spotify Duo, or rent.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl">
              Create Your First Group
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

function GroupCard({ group }: { group: any }) {
  const { user: currentUser } = useAuth();
  
  return (
    <Card className="glass-card rounded-2xl border-white/10 shadow-lg hover:border-primary/50 transition-all group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-3 relative z-10">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg glow-primary">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <CardTitle className="mt-3 text-xl text-white text-glow">{group.name}</CardTitle>
        <CardDescription className="text-white/40">Created on {new Date(group.createdAt).toLocaleDateString()}</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-white/70">Split Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/50">You ({currentUser?.username})</span>
              <span className="font-mono text-primary font-bold">100%</span>
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-6 border-primary/20 hover:bg-primary/5 hover:text-primary rounded-xl">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

function CreateGroupDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateGroup();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, members: [] }, {
      onSuccess: () => {
        onOpenChange(false);
        setName("");
        toast({ title: "Group created!" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Roommates, Family Plan" 
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Create Group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
