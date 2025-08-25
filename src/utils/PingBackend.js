// utils/pingBackend.js
export const pingBackend = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ping`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
};
