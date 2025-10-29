"use client";

import * as React from "react";
import clsx from "clsx";

interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function InputBase({ label, error, className, ...props }: InputBaseProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm text-white font-medium">{label}</label>
      )}
      <input
        {...props}
        className={clsx(
          `
          w-full
          rounded-[var(--radius)]
          px-4 py-2
          bg-input-bg
          border border-input-border
          text-white
          placeholder-[var(--color-placeholder)]
          focus:outline-none
          focus:ring-2
          focus:ring-main-light-blue
          transition-all
        `,
          error && "border-pink focus:ring-pink",
          className
        )}
      />
      {error && <span className="text-xs text-pink">{error}</span>}
    </div>
  );
}
