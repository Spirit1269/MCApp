// app/lib/toast-store.ts
"use client";

import * as React from "react";

export type ToastActionElement = React.ReactNode;
export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ToasterToast = ToastProps & { id: string };

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5_000; // or whatever

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
  | { type: typeof actionTypes.UPDATE_TOAST; toast: Partial<ToasterToast> & { id: string } }
  | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string };

interface State { toasts: ToasterToast[] }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case actionTypes.UPDATE_TOAST:
      return {
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      const scheduleRemoval = (id: string) => {
        if (!toastTimeouts.has(id)) {
          const timeout = setTimeout(() => {
            dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
            toastTimeouts.delete(id);
          }, TOAST_REMOVE_DELAY);
          toastTimeouts.set(id, timeout);
        }
      };
      return {
        toasts: state.toasts.map(t => {
          if (!toastId || t.id === toastId) {
            scheduleRemoval(t.id);
            return { ...t, open: false };
          }
          return t;
        }),
      };
    }
    case actionTypes.REMOVE_TOAST:
      return {
        toasts: action.toastId
          ? state.toasts.filter(t => t.id !== action.toastId)
          : [],
      };
  }
}

let memoryState: State = { toasts: [] };
const listeners = new Set<(s: State) => void>();

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(fn => fn(memoryState));
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId();
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: { ...props, id, open: true, onOpenChange: open => {
      if (!open) dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
    } },
  });
  return {
    dismiss: () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id }),
    update: (upd: Partial<ToasterToast>) => dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...upd, id },
    }),
  };
}

export function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.add(setState);
    return () => { listeners.delete(setState); };
  }, []);
  return {
    ...state,
    toast,
    dismiss: (id?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id }),
  };
}
