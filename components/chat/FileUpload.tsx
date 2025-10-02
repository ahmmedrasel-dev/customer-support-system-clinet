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

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);
        }
      });

      // Promise wrapper for the XHR request
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.url);
            } else {
              reject(new Error("Upload failed"));
            }
          }
        };
      });

      // Set up and send the request
      xhr.open(
        "POST",
        `http://127.0.0.1:8000/api/tickets/${ticketId}/chat/upload`,
        true
      );
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);

      // Wait for the upload to complete
      const fileUrl = await uploadPromise;

      // Send a message with the file URL
      await sendFileMessage(fileUrl);

      toast.success("File uploaded successfully");

      // Call the callback with the file URL
      if (onUploadComplete) {
        onUploadComplete(fileUrl);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const sendFileMessage = async (fileUrl: string) => {
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
      // We won't show this error since the file is already uploaded
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
                <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-2" />
                Uploading {progress}%
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
