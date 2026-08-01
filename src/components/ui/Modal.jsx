import { useEffect } from "react";
import Button from "./Button";

export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "md",
}) {
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
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
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-sm
        p-4
        sm:p-6
      "
      onClick={onClose}
    >
      <div
        className={`
          relative
          flex
          max-h-[90vh]
          w-full
          ${sizes[size]}
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-slate-700
          bg-slate-900
          shadow-2xl
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            bg-slate-900
            px-5
            py-4
            sm:px-8
            sm:py-6
          "
        >
          <h2 className="pr-4 text-2xl font-black sm:text-3xl">
            {title}
          </h2>

          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0 text-xl"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        {/* Content */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-5
            sm:px-8
            sm:py-8
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}