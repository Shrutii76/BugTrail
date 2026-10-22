import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, hint, options, placeholder, id, className = "", ...props },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    return (
      <div className="bt-ui-field">
        {label && (
          <label className="bt-ui-label" htmlFor={selectId}>
            {label}
            {props.required && <span aria-hidden="true"> *</span>}
          </label>
        )}

        <div className={`bt-ui-select-wrap ${error ? "has-error" : ""}`}>
          <select
            {...props}
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={`bt-ui-select ${className}`.trim()}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="bt-ui-select-icon"
            size={16}
            aria-hidden="true"
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
  },
);
