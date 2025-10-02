"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  User,
  XCircle,
  ArrowLeft,
  Download,
  Edit,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ChatWidget } from "@/components/chat";

type Comment = {
  id: number;
  body: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

type Attachment = {
  id: number;
  file_name: string;
  file_path: string;
  mime_type: string;
  size: number;
  created_at: string;
};

type Ticket = {
  id: number;
  subject: string;
  description: string;
  category: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  comments: Comment[];
  attachments: Attachment[];
};

export default function AdminTicketDetailPage() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { token, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      toast.error("Please log in to access admin panel");
      router.push("/");
      return;
    }

    fetchTicket();
  }, [isAuthenticated, authLoading, token, router, ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/tickets/${ticketId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Admin access required");
          router.push("/admin");
          return;
        }
        throw new Error("Failed to fetch ticket");
      }

      const data = await response.json();
      setTicket(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmittingComment(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          body: commentText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();

      // Add the new comment to the ticket
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              comments: [
                ...prev.comments,
                {
                  ...newComment,
                  user: {
                    id: user?.id || 0,
                    name: user?.name || "Admin",
                    email: user?.email || "",
                    role: user?.role || "admin",
                  },
                },
              ],
            }
          : null
      );

      setCommentText("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === ticket?.status) {
      setEditingStatus(false);
      return;
    }

    setUpdatingStatus(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/tickets/${ticketId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update ticket status");
      }

      const updatedTicket = await response.json();
      setTicket((prev) => (prev ? { ...prev, ...updatedTicket } : null));
      setEditingStatus(false);
      toast.success("Ticket status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update ticket status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in_progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Ticket not found</p>
        <Link href="/admin/tickets">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tickets">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Ticket #{ticket.id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{ticket.subject}</p>
        </div>
      </div>

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{ticket.subject}</CardTitle>
              <CardDescription>
                Created on {formatDate(ticket.created_at)} by {ticket.user.name}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${getPriorityColor(ticket.priority)} text-white`}
              >
                {ticket.priority.toUpperCase()}
              </Badge>
              {editingStatus ? (
                <div className="flex items-center gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingStatus(false);
                      setNewStatus(ticket.status);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <Badge
                    className={`${getStatusColor(ticket.status)} text-white`}
                  >
                    {ticket.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingStatus(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Customer</Label>
              <div className="mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{ticket.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.user.email}
                  </p>
                </div>
              </div>
            </div>

            {ticket.category && (
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="mt-1">
                  <Badge variant="outline">{ticket.category}</Badge>
                </p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Attachments</Label>
              <div className="mt-2 space-y-2">
                {ticket.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                  >
                    <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {attachment.file_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(attachment.size)} •{" "}
                        {formatDate(attachment.created_at)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({ticket.comments.length})
          </CardTitle>
          <CardDescription>
            Discussion and updates for this ticket
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Comments */}
          {ticket.comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ticket.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {comment.user.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        >
                          {comment.user.role}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <div className="border-t pt-4">
            <form onSubmit={handleAddComment} className="space-y-4">
              <div>
                <Label htmlFor="comment">Add a Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Type your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="w-full sm:w-auto"
              >
                {submittingComment ? (
                  "Posting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Chat Widget */}
      <ChatWidget ticketId={parseInt(ticketId)} />
    </div>
  );
}
