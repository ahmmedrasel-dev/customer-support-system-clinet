"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon } from "lucide-react";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ChatWindow from "./ChatWindow";
import FileUpload from "./FileUpload";

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

type ChatWidgetProps = {
  ticketId: number;
  initialOpen?: boolean;
};

export default function ChatWidget({
  ticketId,
  initialOpen = false,
}: ChatWidgetProps) {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  // Helper Functions (moved from ChatWindow)
  const fetchMessages = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(
        `${apiUrl}/api/tickets/${ticketId}/chat/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
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
    // নতুন মেসেজ থাকলে তবেই API কল করুন
    const hasUnread = messages.some(msg => !msg.is_read && msg.user.id !== user?.id);
    if (!token || !hasUnread) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      await fetch(
        `${apiUrl}/api/tickets/${ticketId}/chat/messages/read`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // UI-তে মেসেজগুলোকে সাথে সাথে read হিসেবে দেখান
      setMessages(prevMessages => 
        prevMessages.map(msg => ({ ...msg, is_read: true }))
      );
      setUnreadCount(0);

    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Initialize chat state and fetch messages
  useEffect(() => {
    // Only run once on mount
    if (!mountedRef.current) {
      mountedRef.current = true;

      // Restore chat open state
      const storedIsOpen = localStorage.getItem(`chat_open_${ticketId}`);
      if (storedIsOpen === 'true') {
        setIsOpen(true);
      }

      // Initial message fetch
      fetchMessages();
    }
  }, [ticketId, token]);

  // Setup Pusher connection in the parent component
  useEffect(() => {
    if (!token || !user) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "6a68baf450e0cf971739",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "ap2",
        authEndpoint: `${apiUrl}/api/broadcasting/auth`,
        auth: { headers: { Authorization: `Bearer ${token}` } },
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
      }
    );

    // Add connection event listeners for debugging
    pusher.connection.bind('connected', () => {
      console.log('✅ Pusher connected successfully');
      // Re-fetch messages when reconnected to ensure no messages were missed
      fetchMessages();
    });

    pusher.connection.bind('error', (err: any) => {
      console.error('❌ Pusher connection error:', err);
      toast.error('Chat connection error. Reconnecting...');
    });

    pusher.connection.bind('disconnected', () => {
      console.log('🔌 Pusher disconnected');
      setTimeout(() => pusher.connect(), 1000); // Try to reconnect after 1 second
    });

    const channel = pusher.subscribe(`ticket.${ticketId}`);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`✅ Successfully subscribed to ticket.${ticketId}`);
    });

    channel.bind('pusher:subscription_error', (err: any) => {
      console.error(`❌ Failed to subscribe to ticket.${ticketId}:`, err);
    });

    channel.bind("message.sent", (data: Message) => {
      console.log('📨 Received message via Pusher:', data);
      
      // Force re-render by creating new array reference
      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg.id === data.id);
        if (messageExists) {
          console.log('⚠️ Message already exists in state, skipping...', data.id);
          return [...prev]; // Force re-render with same data
        }
        console.log('✅ Adding new message to state:', data.id);
        return [...prev, data];
      });

      if (data.user.id !== user.id) {
        if (isOpen) {
            console.log('📬 Marking new message as read...');
            markMessagesAsRead(); // Remove setTimeout
            setUnreadCount(0); // Reset unread count when message is received while open
        } else {
            console.log('📫 Incrementing unread count...');
            setUnreadCount((prev) => prev + 1);
            // Show notification for new message
            toast.custom((t) => (
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="font-medium">New message in ticket #{ticketId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{data.message}</p>
              </div>
            ), { duration: 5000 });
        }
      }
    });
    
    // Cleanup on component unmount (e.g., when user navigates away)
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`ticket.${ticketId}`);
      pusher.disconnect();
    };
  }, [ticketId, token, user, isOpen]); // isOpen কে dependency হিসেবে যোগ করা হয়েছে

  // Toggle chat and mark messages as read
  const toggleChat = () => {
    setIsOpen((prevIsOpen) => {
      const newIsOpen = !prevIsOpen;
      // Save chat state to localStorage
      localStorage.setItem(`chat_open_${ticketId}`, String(newIsOpen));
      
      // If we are about to open the chat, mark messages as read
      if (newIsOpen) {
        markMessagesAsRead();
        // Also fetch latest messages when opening
        fetchMessages();
      }
      return newIsOpen;
    });
  };
  
  const sendMessage = async (message: string) => {
  if (!message.trim() || !token) return;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(
      `${apiUrl}/api/tickets/${ticketId}/chat/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, type: "text" }),
      }
    );

    if (!response.ok) {
      // সার্ভার থেকে error আসলে তা দেখাবে
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send message");
    }

    // --- key পরিবর্তন এখানে ---
    // ১. API রেসপন্স থেকে সদ্য পাঠানো মেসেজটি গ্রহণ করুন
    const sentMessage: Message = await response.json();

    // ২. UI-তে তাৎক্ষণিকভাবে নতুন মেসেজটি যোগ করুন
    setMessages((prevMessages) => [...prevMessages, sentMessage]);
    
  } catch (error: any) {
    console.error("Error sending message:", error);
    toast.error(error.message || "Failed to send message");
  }
};

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[380px] md:w-[420px] border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium">Support Chat</h3>
            <Button variant="ghost" size="sm" onClick={toggleChat}>
              Close
            </Button>
          </div>

          <ChatWindow
            messages={messages}
            isLoading={loading}
            onSendMessage={sendMessage}
            currentUserId={user?.id}
          />

          <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <FileUpload ticketId={ticketId} />
          </div>
        </div>
      )}

      {!isOpen && (
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