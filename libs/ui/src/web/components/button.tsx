import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-200 hover:from-blue-700 hover:to-purple-700",
      secondary:
        "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50",
      danger:
        "bg-linear-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-200 hover:from-red-700 hover:to-red-800",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
