// app/components/ui/toaster.tsx
"use client";

import * as React from "react";
import { useToast } from "@/lib/toast-store";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastActionElement,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();
  return (
    <div className="fixed top-5 right-5 flex flex-col space-y-2 z-50">
      {toasts.map(t => (
        <Toast key={t.id} open={t.open} onOpenChange={t.onOpenChange}>
          {t.title && <ToastTitle>{t.title}</ToastTitle>}
          {t.description && <ToastDescription>{t.description}</ToastDescription>}
          {t.action && (
            <ToastAction
              asChild
              altText="Execute toast action"            // 👈 add a meaningful description here
            >
              {t.action as ToastActionElement}
            </ToastAction>
          )}

        </Toast>
      ))}
    </div>
  );
}
