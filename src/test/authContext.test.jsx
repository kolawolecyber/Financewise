import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/useAuth";

const AuthProbe = () => {
  const { authenticated, user, login, logout } = useAuth();

  return (
    <div>
      <output data-testid="authenticated">{String(authenticated)}</output>
      <output data-testid="user">{user?.name || ""}</output>
      <button onClick={() => login({ name: "Ada" })}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => localStorage.clear());

  it("tracks the cookie-backed session without storing credentials", async () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("Ada");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "logout" }));
    await waitFor(() => {
      expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
      expect(screen.getByTestId("user")).toHaveTextContent("");
    });
  });
});
