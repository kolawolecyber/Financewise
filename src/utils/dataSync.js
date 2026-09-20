import { useEffect, useRef } from "react";

const DATA_CHANGED_EVENT = "financewise:data-changed";
const DATA_CHANGED_KEY = "financewise:last-change";

export const notifyDataChanged = () => {
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
  localStorage.setItem(DATA_CHANGED_KEY, String(Date.now()));
};

export const useDataRefresh = (refresh, enabled = true) => {
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!enabled) return undefined;

    const runRefresh = () => refreshRef.current();
    window.addEventListener(DATA_CHANGED_EVENT, runRefresh);
    window.addEventListener("focus", runRefresh);
    window.addEventListener("storage", runRefresh);

    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, runRefresh);
      window.removeEventListener("focus", runRefresh);
      window.removeEventListener("storage", runRefresh);
    };
  }, [enabled]);
};
