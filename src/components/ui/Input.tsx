import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, prefix, suffix, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-slate-400 text-sm select-none">{prefix}</span>
          )}
          <input
            id={id}
            ref={ref}
            className={clsx(
              "w-full rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-150 ease-out hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:hover:border-slate-200",
              prefix ? "pl-7" : "pl-3",
              suffix ? "pr-10" : "pr-3",
              "py-2.5",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-slate-400 text-sm select-none">{suffix}</span>
          )}
        </div>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
