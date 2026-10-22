import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, id, className = "", ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;

    return (
      <div className="bt-ui-field">
        {label && (
          <label className="bt-ui-label" htmlFor={textareaId}>
            {label}
            {props.required && <span aria-hidden="true"> *</span>}
          </label>
        )}

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          className={`bt-ui-textarea ${error ? "has-error" : ""} ${className}`.trim()}
        />

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
  },
);
