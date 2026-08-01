import Button from "./Button";

export default function ConfirmationModal({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

        <h2 className="text-3xl font-black">
          {title}
        </h2>

        <p className="mt-4 text-slate-400">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>

        </div>

      </div>

    </div>
  );
}