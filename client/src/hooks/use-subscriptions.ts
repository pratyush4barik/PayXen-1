import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Subscription, InsertSubscription } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: [api.subscriptions.list.path],
    queryFn: async () => {
      const res = await fetch(api.subscriptions.list.path);
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return await res.json();
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSubscription) => {
      const res = await fetch(api.subscriptions.create.path, {
        method: api.subscriptions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create subscription");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.subscriptions.list.path] });
      toast({ title: "Success", description: "Subscription added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add subscription.", variant: "destructive" });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.subscriptions.delete.path, { id });
      const res = await fetch(url, { method: api.subscriptions.delete.method });
      if (!res.ok) throw new Error("Failed to delete subscription");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.subscriptions.list.path] });
      toast({ title: "Deleted", description: "Subscription removed." });
    },
  });
}
