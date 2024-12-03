import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ChatAssistant = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"resume" | "cover_letter">("resume");
  const queryClient = useQueryClient();

  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const response = await supabase.functions.invoke("chat-assistant", {
        body: { message, type, userId: user.id },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Message sent successfully");
    },
    onError: (error) => {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage.mutate(message);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Select value={type} onValueChange={(value: "resume" | "cover_letter") => setType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="resume">Resume</SelectItem>
            <SelectItem value="cover_letter">Cover Letter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask for help with your ${type === "resume" ? "resume" : "cover letter"}...`}
          className="min-h-[100px]"
        />
        <Button
          type="submit"
          disabled={sendMessage.isPending || !message.trim()}
          className="w-full"
        >
          {sendMessage.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Chat History</h3>
        {isLoadingHistory ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory?.map((chat) => (
              <div key={chat.id} className="border rounded-lg p-4 space-y-2">
                <div className="bg-muted p-3 rounded">
                  <p className="font-medium">You:</p>
                  <p>{chat.message}</p>
                </div>
                <div className="bg-primary/5 p-3 rounded">
                  <p className="font-medium">Assistant:</p>
                  <p>{chat.response}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};