"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";
import FileUpload from "./FileUpload";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon } from "lucide-react";

type ChatWidgetProps = {
  ticketId: number;
  initialOpen?: boolean;
};

export default function ChatWidget({
  ticketId,
  initialOpen = false,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleNewMessage = () => {
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[380px] md:w-[420px] border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium">Support Chat</h3>
            <Button variant="ghost" size="sm" onClick={toggleChat}>
              Close
            </Button>
          </div>

          <ChatWindow ticketId={ticketId} />

          <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <FileUpload ticketId={ticketId} />
          </div>
        </div>
      ) : (
        <Button onClick={toggleChat} className="shadow-lg">
          <MessageCircleIcon className="mr-2 h-5 w-5" />
          Chat
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
