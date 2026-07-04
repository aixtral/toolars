"use client";

import { useCallback, useEffect, useRef } from "react";

export function useDialogFocus(isOpen: boolean) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef(null as HTMLElement | null);

  useEffect(() => {
    if (!isOpen) return;

    dialogRef.current?.focus();
  }, [isOpen]);

  const restoreTriggerFocus = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const rememberTrigger = useCallback((trigger: HTMLButtonElement | null) => {
    triggerRef.current = trigger;
  }, []);

  return { dialogRef, rememberTrigger, restoreTriggerFocus, triggerRef };
}
