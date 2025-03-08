import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

/**
 * Renders a toast notification container.
 *
 * Retrieves the current list of toast notifications via the `useToast` hook and displays each
 * notification using the `Toast` component. Each toast may display a title, description, and an
 * optional action, and includes a close button provided by `ToastClose`. The `ToastViewport` defines
 * the area where the toast notifications are shown.
 *
 * @returns A JSX element containing the toast notification provider and the active toasts.
 */
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
