export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = "Error",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-red-800 font-semibold mb-2">{title}</h3>
      <p className="text-red-600 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-700 hover:text-red-800 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
