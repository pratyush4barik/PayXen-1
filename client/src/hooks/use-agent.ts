import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useRunAgent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.agent.run.path, {
        method: api.agent.run.method,
      });
      if (!res.ok) throw new Error("Agent failed to run");
      return await res.json();
    },
    onSuccess: (data: any) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [api.subscriptions.list.path] });
      
      const logMessage = data.logs.length > 0 ? data.logs[0] : "Agent cycle complete.";
      toast({ 
        title: "Ghost Agent Report", 
        description: `Processed ${data.processed} items. ${logMessage}`,
      });
    },
    onError: () => {
      toast({ title: "Agent Error", description: "The Ghost Agent encountered an issue.", variant: "destructive" });
    }
  });
}
