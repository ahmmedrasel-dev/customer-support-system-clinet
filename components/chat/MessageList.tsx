"use client";

import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileIcon } from "lucide-react";

// We'll need to install these dependencies
// date-fns for date formatting
// shadcn/ui skeleton component

type DateFormatter = {
  format: (date: Date, format: string) => string;
};

// Simple date formatter until we install date-fns
const dateFormatter: DateFormatter = {
  format: (date, formatString) => {
    if (formatString === "h:mm a") {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return date.toLocaleString();
  },
};

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

type MessageListProps = {
  messages: Message[];
  currentUserId?: number;
  isLoading: boolean;
};

export default function MessageList({
  messages,
  currentUserId,
  isLoading,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-start space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No messages yet</p>
          <p className="text-sm">
            Start the conversation by sending a message.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => {
        const isCurrentUser = message.user.id === currentUserId;

        if (message.type === "system") {
          return (
            <div key={message.id} className="flex justify-center my-2">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-xs text-gray-500 dark:text-gray-400">
                {message.message}
              </div>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start max-w-[70%]">
              {!isCurrentUser && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>
                    {message.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div>
                <div
                  className={`rounded-lg p-3 ${
                    isCurrentUser
                      ? "bg-blue-500 text-white dark:bg-blue-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="text-xs font-medium mb-1">
                      {message.user.name}{" "}
                      <span className="text-xs font-normal opacity-70">
                        ({message.user.role})
                      </span>
                    </div>
                  )}

                  {message.type === "file" ? (
                    <div className="flex items-center space-x-2">
                      <FileIcon className="h-5 w-5" />
                      <a
                        href={message.message}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Attachment
                      </a>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">{message.message}</p>
                  )}
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    isCurrentUser ? "text-right" : "text-left"
                  }`}
                >
                  {dateFormatter.format(new Date(message.created_at), "h:mm a")}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex items-start space-x-2">
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );
}
