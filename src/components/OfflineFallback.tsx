import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";

interface OfflineFallbackProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

const OfflineFallback: React.FC<OfflineFallbackProps> = ({
  title = "You're Offline",
  message = "It looks like you're not connected to the internet. Check your connection and try again.",
  showRetry = true,
  onRetry,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          {showRetry && (
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Some features may be available offline:</p>
            <ul className="mt-2 space-y-1">
              <li>• View saved financial data</li>
              <li>• Add new entries (sync when online)</li>
              <li>• Basic calculations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineFallback;
