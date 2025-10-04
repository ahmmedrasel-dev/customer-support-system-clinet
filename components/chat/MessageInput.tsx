"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon, PaperclipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type MessageInputProps = {
  onSendMessage: (message: string) => void;
  onSendFile?: (file: File) => void;
  autoFocus?: boolean;
};

export default function MessageInput({
  onSendMessage,
  onSendFile,
  autoFocus = true,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the textarea when component mounts or when autoFocus changes
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSendMessage(message);
      setMessage("");
      // Refocus the textarea after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSendFile) return;

    setIsSubmitting(true);
    try {
      await onSendFile(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900"
    >
      <div className="flex items-end space-x-2">
        <Textarea
          ref={textareaRef}
          className="min-h-[80px] max-h-[160px] flex-1 resize-none"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
        />

        <div className="flex space-x-2">
          {onSendFile && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleFileClick}
                disabled={isSubmitting}
              >
                <PaperclipIcon className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
            </>
          )}

          <Button
            type="submit"
            size="icon"
            disabled={isSubmitting || !message.trim()}
          >
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
