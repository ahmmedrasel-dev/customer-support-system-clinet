"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/components/auth/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

// Validation schema
const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  attachment: z.any().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function CreateTicketPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  // Check authentication on component mount
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to create a ticket");
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      priority: "low",
    },
  });

  async function onSubmit(data: TicketFormValues) {
    try {
      const formData = new FormData();
      formData.append("subject", data.subject);
      formData.append("description", data.description);
      if (data.category) formData.append("category", data.category);
      formData.append("priority", data.priority);
      if (data.attachment) {
        formData.append("file", data.attachment); // Changed to 'file' to match Laravel's file upload handling
      }

      // Debug FormData contents
      console.log("Form Data Contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      if (!isAuthenticated || !token) {
        toast.error("You must be logged in to create a ticket");
        router.push("/"); // Redirect to login
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server response:", errorData);
        throw new Error(errorData?.message || "Failed to create ticket");
      }

      const result = await response.json();
      console.log("Success response:", result);

      toast.success("Ticket created successfully!");
      router.push("/customer/tickets");
    } catch (error) {
      console.error("Full error details:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create ticket. Please try again."
      );
    }
  }

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create a Support Ticket</CardTitle>
          <CardDescription>
            Fill out the form to submit a new support ticket
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ticket subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your issue in detail"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ticket category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit Ticket
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
