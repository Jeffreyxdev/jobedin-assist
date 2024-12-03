import { ChatAssistant } from "@/components/ChatAssistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChatBuilder = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume & Cover Letter Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ChatAssistant />
      </CardContent>
    </Card>
  );
};

export default ChatBuilder;