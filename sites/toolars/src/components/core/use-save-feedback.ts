import { useCallback, useState } from "react";

const DEFAULT_FEEDBACK_MS = 2400;

/**
 * Save buttons in tool workspaces persist to localStorage silently, which
 * reads as a dead button. This hook gives a transient "saved" flag the
 * workspace can render as visible confirmation next to the save action.
 */
export function useSaveFeedback(timeoutMs = DEFAULT_FEEDBACK_MS) {
  const [saved, setSaved] = useState(false);

  const flashSaved = useCallback(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), timeoutMs);
  }, [timeoutMs]);

  return { flashSaved, saved };
}
