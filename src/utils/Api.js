const API_BASE = import.meta.env.VITE_API_BASE_URL; // change to your backend port

const signup = async (userData) => {
    try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }
    return data;
  } catch (err) {
    return { message: err.message || "Network error" };
  }
};

 const login = async (credentials) => {
 try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  } catch (err) {
    return { message: err.message || "Network error" };
  }
};
 const fetchBudgets = async (token) => {
  try{
  const res = await fetch(`${API_BASE}/budgets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch expenses");
    return data;
  } catch (err) {
    return { message: err.message || "Network error" };
  }
};

 const createBudget = async (token, form) => {
  const res = await fetch(`${API_BASE}/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });
  return res.json();
};

const fetchExpenses = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch expenses");
    return data;
  } catch (err) {
    return { message: err.message || "Network error" };
  }
};

// Add others later like createBudget, fetchTransactions, etc.
export {login, signup, createBudget, fetchBudgets, fetchExpenses} 