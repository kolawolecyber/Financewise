import API from "../services/api";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback;

const signup = async userData => {
  try {
    const { data } = await API.post("/api/auth/register", userData);
    return data;
  } catch (error) {
    return { message: getErrorMessage(error, "Signup failed") };
  }
};

const login = async credentials => {
  try {
    const { data } = await API.post("/api/auth/login", credentials);
    return data;
  } catch (error) {
    return { message: getErrorMessage(error, "Login failed") };
  }
};

const fetchWithAuth = async (url, options = {}, _token, logout) => {
  try {
    const { data } = await API.request({
      url,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers,
    });
    return data;
  } catch (error) {
    if (error.response?.status === 401) logout();
    throw new Error(getErrorMessage(error, "Request failed"));
  }
};

const fetchBudgets = async () => {
  const { data } = await API.get("/api/budgets");
  return data;
};

const createBudget = async (_token, form) => {
  const { data } = await API.post("/api/budgets", form);
  return data;
};

const fetchExpenses = async () => {
  const { data } = await API.get("/api/expenses");
  return data;
};

export { login, signup, createBudget, fetchBudgets, fetchExpenses, fetchWithAuth };