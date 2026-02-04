import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-semibold text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          className={`px-4 py-3 border-2 border-gray-200 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span> {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
