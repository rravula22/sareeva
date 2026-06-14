import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark"
          >
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-dark shadow-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
