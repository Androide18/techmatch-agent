"use client";

import React from "react";
import { clsx } from "clsx";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "xs" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-[--color-main-light-blue] text-white hover:opacity-90",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-[--color-main-light-blue] bg-bg text-white hover:bg-[--color-main-light-blue]/10",
  secondary: "bg-gray-600 text-white hover:bg-gray-500",
  ghost: "bg-transparent text-white hover:bg-[--color-main-light-blue]/10",
  link: "text-[--color-main-light-blue] underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  xs: "h-8 px-2",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};
