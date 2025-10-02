"use client";

import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

type Message = {
  id: number;
  message: string;
  type: "text" | "file" | "system";
  is_read: boolean;
  created_at: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
};

// Props এর জন্য নতুন টাইপ
type ChatWindowProps = {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
  currentUserId?: number;
};

export default function ChatWindow({
  messages,
  isLoading,
  onSendMessage,
  currentUserId,
}: ChatWindowProps) {

  return (
    <div className="h-[500px] flex flex-col">
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
      />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}