import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateSubscription } from "@/hooks/use-subscriptions";
import { Plus, Loader2 } from "lucide-react";
import { z } from "zod";

export function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false);
  const createSub = useCreateSubscription();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billingCycle: "monthly",
    category: "Entertainment",
    nextBillingDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSub.mutate({
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      category: formData.category,
      nextBillingDate: new Date(formData.nextBillingDate),
      startDate: new Date(),
      status: "active",
      userId: 0, // Backend handles this
      autoCancel: false,
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          name: "",
          price: "",
          billingCycle: "monthly",
          category: "Entertainment",
          nextBillingDate: new Date().toISOString().split('T')[0],
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">New Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input 
              id="name" 
              placeholder="Netflix, Spotify..." 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="bg-background/50 border-border/50 focus:ring-primary/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                className="bg-background/50 border-border/50 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cycle">Billing Cycle</Label>
              <Select 
                value={formData.billingCycle} 
                onValueChange={(val) => setFormData({...formData, billingCycle: val})}
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData({...formData, category: val})}
            >
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Next Billing Date</Label>
            <Input 
              id="date" 
              type="date"
              value={formData.nextBillingDate}
              onChange={(e) => setFormData({...formData, nextBillingDate: e.target.value})}
              required
              className="bg-background/50 border-border/50 focus:ring-primary/20"
            />
          </div>

          <Button type="submit" disabled={createSub.isPending} className="w-full mt-2">
            {createSub.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Subscription
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
