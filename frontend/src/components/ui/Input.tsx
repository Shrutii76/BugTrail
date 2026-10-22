import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, id, className = "", ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="bt-ui-field">
      {label && (
        <label className="bt-ui-label" htmlFor={inputId}>
          {label}
          {props.required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <div className={`bt-ui-control ${error ? "has-error" : ""}`}>
        {leftIcon && (
          <span className="bt-ui-leading-icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          className={`bt-ui-input ${className}`.trim()}
        />
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={error ? "bt-ui-error" : "bt-ui-hint"}
          role={error ? "alert" : undefined}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
});
