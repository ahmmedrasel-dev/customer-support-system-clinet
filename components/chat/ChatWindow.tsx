"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "react-hot-toast";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

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

type ChatWindowProps = {
  ticketId: number;
};

export default function ChatWindow({ ticketId }: ChatWindowProps) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<any>(null);

  // Fetch initial messages
  useEffect(() => {
    if (!token) return;
    fetchMessages();

    // Mark messages as read when component mounts
    markMessagesAsRead();
  }, [ticketId, token]);

  // Setup Pusher connection
  useEffect(() => {
    if (!token) return;

    // Initialize Pusher
    pusherRef.current = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY || "6a68baf450e0cf971739",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
        authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Subscribe to ticket channel
    channelRef.current = pusherRef.current.subscribe(
      `private-ticket.${ticketId}`
    );

    // Listen for new messages
    channelRef.current.bind("message.sent", (data: Message) => {
      setMessages((prev) => [...prev, data]);

      // If message is from another user, mark it as read
      if (data.user.id !== user?.id) {
        markMessagesAsRead();
      }
    });

    // Handle connection errors
    pusherRef.current.connection.bind("error", (err: any) => {
      console.error("Pusher connection error:", err);
      toast.error(
        "Real-time connection failed. Messages may not update automatically."
      );
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherRef.current?.unsubscribe(`private-ticket.${ticketId}`);
      }

      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, [ticketId, token, user?.id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/tickets/${ticketId}/chat/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        toast.error("Failed to load chat messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load chat messages");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await fetch(
        `http://127.0.0.1:8000/api/tickets/${ticketId}/chat/messages/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tickets/${ticketId}/chat/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            type: "text",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      // Optimistically add message to UI
      const sentMessage = {
        id: Date.now(), // temporary ID until we get the real one from Pusher
        message,
        type: "text" as const,
        is_read: false,
        created_at: new Date().toISOString(),
        user: {
          id: user?.id || 0,
          name: user?.name || "You",
          role: user?.role || "unknown",
        },
      };

      setMessages((prev) => [...prev, sentMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 h-[500px] flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">Real-time Chat</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {loading ? "Loading conversation..." : `${messages.length} messages`}
        </p>
      </div>

      <MessageList
        messages={messages}
        currentUserId={user?.id}
        isLoading={loading}
      />

      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}
