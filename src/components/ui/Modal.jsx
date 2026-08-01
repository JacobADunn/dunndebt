import { useEffect } from "react";
import Button from "./Button";

export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "md",
}) {

console.log("Modal open:", open);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () =>
      document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          relative
          w-full
          ${sizes[size]}
          rounded-3xl
          border
          border-slate-700
          bg-slate-900
          shadow-2xl
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-8 py-6">

          <h2 className="text-3xl font-black">
            {title}
          </h2>

          <Button
            variant="ghost"
            className="text-2xl"
            onClick={onClose}
          >
            ✕
          </Button>

        </div>

        {/* Content */}

        <div className="max-h-[75vh] overflow-y-auto p-8">
          {children}
        </div>

      </div>
    </div>
  );
}