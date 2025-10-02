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
  isVisible?: boolean;
  onUnreadUpdate?: (count: number) => void;
};

export default function ChatWindow({
  ticketId,
  isVisible = true,
  onUnreadUpdate,
}: ChatWindowProps) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<any>(null);
  const isVisibleRef = useRef(isVisible);
  const onUnreadUpdateRef = useRef(onUnreadUpdate);

  // Update refs when props change
  useEffect(() => {
    isVisibleRef.current = isVisible;
    onUnreadUpdateRef.current = onUnreadUpdate;
  }, [isVisible, onUnreadUpdate]);

  // Fetch initial messages
  useEffect(() => {
    if (!token) return;
    fetchMessages();

    // Mark messages as read when component mounts
    markMessagesAsRead();
  }, [ticketId, token]);

  // Mark messages as read when chat becomes visible
  useEffect(() => {
    if (isVisible && token) {
      markMessagesAsRead();
    }
  }, [isVisible, token]);

  // Setup Pusher connection (only recreate when essential props change)
  useEffect(() => {
    if (!token) return;

    // Clean up existing connection
    if (channelRef.current) {
      channelRef.current.unbind_all();
      pusherRef.current?.unsubscribe(`private-ticket.${ticketId}`);
    }
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }

    // Initialize Pusher
    pusherRef.current = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY || "6a68baf450e0cf971739",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/broadcasting/auth`,
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
      console.log("✅ Received message:", data); // Debug log
      console.log("📊 Current messages count:", messages.length);
      console.log("👁️ Is visible:", isVisibleRef.current);

      setMessages((prev) => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some((msg) => msg.id === data.id);
        if (exists) {
          console.log("⚠️ Duplicate message detected, skipping");
          return prev;
        }
        console.log("✨ Adding new message to state");
        return [...prev, data];
      });

      // Handle unread count and mark as read based on current visibility
      if (data.user.id !== user?.id) {
        if (isVisibleRef.current) {
          // If chat is visible, mark message as read immediately
          console.log("📖 Marking message as read (chat is visible)");
          markMessagesAsRead();
        } else {
          // If chat is not visible, increment unread count
          console.log("🔔 Incrementing unread count (chat is hidden)");
          onUnreadUpdateRef.current?.(1);
        }
      }
    });

    // Handle connection events
    pusherRef.current.connection.bind("connected", () => {
      console.log("🟢 Pusher connected successfully!"); // Debug log
      console.log("📡 Channel:", `private-ticket.${ticketId}`);
    });

    pusherRef.current.connection.bind("error", (err: any) => {
      console.error("🔴 Pusher connection error:", err);
      toast.error(
        "Real-time connection failed. Messages may not update automatically."
      );
    });

    pusherRef.current.connection.bind("disconnected", () => {
      console.log("🟡 Pusher disconnected");
    });

    // Debug: Log subscription success
    channelRef.current.bind("pusher:subscription_succeeded", () => {
      console.log(
        "✅ Successfully subscribed to channel:",
        `private-ticket.${ticketId}`
      );
    });

    channelRef.current.bind("pusher:subscription_error", (err: any) => {
      console.error("❌ Subscription error:", err);
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
  }, [ticketId, token, user?.id]); // Remove isVisible and onUnreadUpdate from dependencies

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/chat/messages`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/chat/messages/read`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/chat/messages`,
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
        id: Date.now(),
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
