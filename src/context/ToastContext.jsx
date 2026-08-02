import {
  createContext,
  useContext,
  useState,
} from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  function showToast({
    type = "success",
    title,
    message = "",
  }) {
    setToast({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-50
            w-96
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            p-5
            shadow-2xl
            animate-in
            slide-in-from-bottom-4
            duration-300
          "
        >
          <p className="font-bold text-white">
            {toast.title}
          </p>

          {toast.message && (
            <p className="mt-1 text-sm text-slate-400">
              {toast.message}
            </p>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}