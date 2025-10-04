import React from "react";

type DevPlaceholderProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
};

export function DevPlaceholder({
  title = "Under development",
  description = "This page or component is not ready yet. Use this placeholder while you build the final UI.",
  actionLabel = "Notify me",
  onAction,
  children,
  className = "",
}: DevPlaceholderProps) {
  return (
    <div
      className={`max-w-xl mx-auto p-8 bg-gradient-to-br from-yellow-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-xl shadow-lg transition-all duration-300 ${className}`}
      style={{ animation: "fadeIn 0.7s" }}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="mb-2 animate-bounce">
          {/* Modern construction icon */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-500 dark:text-yellow-300"
          >
            <path d="M9 17v-6a3 3 0 0 1 6 0v6" />
            <rect x="5" y="17" width="14" height="2" rx="1" />
            <path d="M2 17h20" />
          </svg>
        </span>
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100 shadow">
            DEV
          </span>
        </div>
        <p className="mt-2 text-base text-gray-700 dark:text-gray-300 text-center max-w-md">
          {description}
        </p>
      </div>

      {children && <div className="mt-6">{children}</div>}

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M12 19v-6m0 0V5m0 8l-3-3m3 3l3-3" />
          </svg>
          {actionLabel}
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

export default DevPlaceholder;
