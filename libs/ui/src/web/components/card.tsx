import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100/50 p-6 transition-all duration-300 ${
        onClick ? "cursor-pointer hover:shadow-2xl hover:-translate-y-1" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
