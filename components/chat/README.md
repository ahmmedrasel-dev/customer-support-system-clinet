# Real-Time Chat Integration Guide

This guide explains how to integrate the real-time chat functionality into the Customer Support System.

## Frontend Components

The chat system consists of the following components:

1. `ChatWindow.tsx`: Main chat container that manages messages and real-time updates
2. `MessageList.tsx`: Displays chat messages with proper formatting
3. `MessageInput.tsx`: Input field for sending messages
4. `FileUpload.tsx`: Handles file attachments
5. `ChatWidget.tsx`: Floating chat widget for easy integration

## Setup

### Dependencies

Ensure you have the following dependencies installed:

```bash
npm install pusher-js date-fns react-hot-toast
```

### Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
```

## Backend Integration

The chat system expects the Laravel backend to provide the following API endpoints:

1. `GET /api/tickets/{id}/chat/messages`: Fetch chat history
2. `POST /api/tickets/{id}/chat/messages`: Send a new message
3. `POST /api/tickets/{id}/chat/messages/read`: Mark messages as read
4. `POST /api/tickets/{id}/chat/upload`: Upload file attachments

Additionally, the backend should use Pusher to broadcast new messages on the `private-ticket.{id}` channel.

## Using the Chat Widget

To add the chat widget to a page:

```tsx
import { ChatWidget } from "@/components/chat";

export default function TicketDetailPage() {
  const ticketId = 123; // Replace with your ticket ID
  
  return (
    <div>
      {/* Your page content */}
      
      {/* Add the chat widget */}
      <ChatWidget ticketId={ticketId} initialOpen={false} />
    </div>
  );
}
```

## Authentication

The chat system relies on the `useAuth()` hook to get the current user's token for API requests. Ensure your authentication system provides:

1. `user`: The current user object with `id`, `name`, and `role`
2. `token`: The JWT token for API authentication

## Customizing the Chat

You can customize the appearance of the chat components by modifying their CSS classes. The components use Tailwind CSS for styling.