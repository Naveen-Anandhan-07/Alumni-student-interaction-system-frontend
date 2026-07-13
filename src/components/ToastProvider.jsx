import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Info, X, XCircle } from "lucide-react";
import { subscribeToToasts } from "../utils/toast";
import "../styles/Toast.css";

const SUCCESS_WORDS = /success|updated|accepted|rejected|removed|cancelled|sent|posted|registered/i;
const WARNING_WORDS = /please|already|only |cannot|not available|select |write /i;
const ERROR_WORDS = /fail|unable|invalid|error/i;

function inferVariant(message) {
  if (ERROR_WORDS.test(message)) return "error";
  if (WARNING_WORDS.test(message)) return "warning";
  if (SUCCESS_WORDS.test(message)) return "success";
  return "info";
}

const toastMeta = {
  success: { icon: Check, title: "Success" },
  error: { icon: XCircle, title: "Something went wrong" },
  warning: { icon: AlertTriangle, title: "Heads up" },
  info: { icon: Info, title: "Notice" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const text = String(message ?? "").trim();
    if (!text) return;

    const id = ++nextId.current;
    const variant = options.variant || inferVariant(text);
    const duration = options.duration ?? 4500;

    setToasts((current) => [
      ...current.slice(-3),
      { id, message: text, variant, title: options.title },
    ]);

    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  useEffect(() => {
    return subscribeToToasts(showToast);
  }, [showToast]);

  return (
    <>
      {children}
      <section className="toast-viewport" aria-label="Notifications" aria-live="polite">
        {toasts.map((toast) => {
          const meta = toastMeta[toast.variant] || toastMeta.info;
          const Icon = meta.icon;

          return (
            <div className={`app-toast app-toast--${toast.variant}`} role="status" key={toast.id}>
              <span className="app-toast__icon" aria-hidden="true">
                <Icon size={19} strokeWidth={2.3} />
              </span>
              <div className="app-toast__copy">
                <strong>{toast.title || meta.title}</strong>
                <p>{toast.message}</p>
              </div>
              <button
                className="app-toast__close"
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={17} />
              </button>
              <span className="app-toast__timer" aria-hidden="true" />
            </div>
          );
        })}
      </section>
    </>
  );
}
