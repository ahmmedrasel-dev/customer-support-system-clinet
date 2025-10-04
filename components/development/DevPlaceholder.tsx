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
      className={`max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
              DEV
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>

      {children && <div className="mt-4">{children}</div>}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export default DevPlaceholder;
