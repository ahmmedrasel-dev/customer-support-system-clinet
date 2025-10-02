"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FileIcon, UploadIcon } from "lucide-react";

type FileUploadProps = {
  ticketId: number;
  onUploadComplete?: (url: string) => void;
};

export default function FileUpload({
  ticketId,
  onUploadComplete,
}: FileUploadProps) {
  const { token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!token) {
      toast.error("You must be logged in to upload files");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Create fetch request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/chat/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed with status ${response.status}`
        );
      }

      const result = await response.json();
      const fileUrl = result.url;
      await sendFileMessage(fileUrl);

      toast.success("File uploaded successfully");
      if (onUploadComplete) {
        onUploadComplete(fileUrl);
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const sendFileMessage = async (fileUrl: string) => {
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
            message: fileUrl,
            type: "file",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send file message");
      }
    } catch (error) {
      console.error("Error sending file message:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <span>
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-primary rounded-full animate-spin mr-2" />
                Uploading {progress > 0 ? `${Math.round(progress)}%` : "..."}
              </>
            ) : (
              <>
                <UploadIcon className="h-4 w-4 mr-2" />
                Attach File
              </>
            )}
          </span>
        </Button>
      </label>
    </div>
  );
}
