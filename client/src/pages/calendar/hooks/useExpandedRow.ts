import { useState, useCallback } from "react";

export function useExpandedRow() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);
  const reset = useCallback(() => setExpandedId(null), []);
  return { expandedId, toggle, reset };
}
