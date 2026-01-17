import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGroups, useCreateGroup, useDeleteMember } from "@/hooks/use-groups";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Loader2, X, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Groups() {
  const { user: currentUser } = useAuth();
  const { data: groups, isLoading } = useGroups();
  const createGroup = useCreateGroup();
  const deleteMember = useDeleteMember();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [members, setMembers] = useState<{ username: string; splitPercentage: number }[]>([
    { username: currentUser?.username || "", splitPercentage: 100 }
  ]);

  const addMember = () => {
    setMembers([...members, { username: "", splitPercentage: 0 }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof typeof members[0], value: string | number) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const totalSplit = members.reduce((sum, m) => sum + m.splitPercentage, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (Math.abs(totalSplit - 100) > 0.01) return;
    
    createGroup.mutate({ name, members }, {
      onSuccess: () => {
        setOpen(false);
        setName("");
        setMembers([{ username: currentUser?.username || "", splitPercentage: 100 }]);
      }
    });
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Shared Groups</h1>
          <p className="text-muted-foreground mt-1">Split expenses with friends and family</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50 max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Name</label>
                <Input 
                  placeholder="e.g. Family Plan, Roommates"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Members & Splits</label>
                  <Button type="button" variant="ghost" size="sm" onClick={addMember} className="text-primary">
                    <Plus className="w-4 h-4 mr-1" /> Add Member
                  </Button>
                </div>
                
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="Username"
                        value={member.username}
                        onChange={(e) => updateMember(index, 'username', e.target.value)}
                        required
                        disabled={index === 0 && member.username === currentUser?.username}
                      />
                    </div>
                    <div className="w-24 relative">
                      <Input 
                        type="number"
                        placeholder="%"
                        value={member.splitPercentage}
                        onChange={(e) => updateMember(index, 'splitPercentage', parseFloat(e.target.value) || 0)}
                        required
                        className="pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                    </div>
                    {index > 0 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeMember(index)}>
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}

                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${Math.abs(totalSplit - 100) < 0.01 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {Math.abs(totalSplit - 100) < 0.01 ? (
                    <>Total: 100% (Ready)</>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Total must be 100% (Current: {totalSplit}%)
                    </>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createGroup.isPending || Math.abs(totalSplit - 100) > 0.01}>
                {createGroup.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Group
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : groups?.length === 0 ? (
        <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No groups yet</h3>
          <p className="text-muted-foreground">Create a group to start sharing subscription costs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group) => (
            <Card key={group.id} className="p-6 bg-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Expense</p>
                  <p className="font-bold text-lg font-mono">${Number(group.totalExpense).toFixed(2)}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{group.name}</h3>
              
              <div className="flex -space-x-2 mt-4">
                <Avatar className="w-8 h-8 border-2 border-background">
                  <AvatarFallback className="bg-primary/20 text-xs">ME</AvatarFallback>
                </Avatar>
                {/* Dynamically show members if possible, but keep mock for now since schema is simple */}
                <Avatar className="w-8 h-8 border-2 border-background">
                  <AvatarFallback className="bg-secondary text-xs">AB</AvatarFallback>
                </Avatar>
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                  +2
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium">Split Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">You (Creator)</span>
                    <span className="font-mono">100%</span>
                  </div>
                  {/* Additional member splits would go here */}
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6 border-primary/20 hover:bg-primary/5 hover:text-primary">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
