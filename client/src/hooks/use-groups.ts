import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Group } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: [api.groups.list.path],
    queryFn: async () => {
      const res = await fetch(api.groups.list.path);
      if (!res.ok) throw new Error("Failed to fetch groups");
      return await res.json();
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string, members: string[] }) => {
      const res = await fetch(api.groups.create.path, {
        method: api.groups.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create group");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.groups.list.path] });
      toast({ title: "Group Created", description: "Your group is ready." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create group.", variant: "destructive" });
    },
  });
}
