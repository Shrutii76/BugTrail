import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  label?: string;
}

export function Dropdown({
  trigger,
  items,
  align = "right",
  label = "Open menu",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="bt-ui-dropdown" ref={rootRef}>
      <button
        type="button"
        className="bt-ui-dropdown-trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <div
          className={`bt-ui-dropdown-menu bt-ui-dropdown-menu--${align}`}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={`bt-ui-dropdown-item ${item.danger ? "is-danger" : ""}`}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
