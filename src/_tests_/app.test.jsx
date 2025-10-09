// src/App.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Mock Firebase
jest.mock("./components/firebase", () => ({
  auth: {
    currentUser: null,
    signOut: jest.fn(),
  },
  db: {},
}));

describe("App Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders home page by default", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Courses We Offer/i)).toBeInTheDocument();
  });

  test("navigates to student register page", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const registerLink = screen.getByText(/Register/i, { exact: false }) || screen.getByRole("link", { name: /Register/i });
    if (registerLink) fireEvent.click(registerLink);

    await waitFor(() => {
      expect(screen.getByText(/Student Registration/i)).toBeInTheDocument();
    });
  });

  test("renders student login page", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const loginRoute = screen.getByText(/Login/i, { exact: false }) || screen.getByRole("link", { name: /Login/i });
    expect(loginRoute).toBeInTheDocument();
  });

  test("renders admin page with tabs", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Simulate navigation to admin
    window.history.pushState({}, "Admin", "/admin");

    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Students/i)).toBeInTheDocument();
    expect(screen.getByText(/Admissions/i)).toBeInTheDocument();
  });

  test("logout button exists and is clickable", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    window.history.pushState({}, "Admin", "/admin");

    const logoutBtn = screen.getByText(/Logout/i);
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
    const { auth } = require("./components/firebase");
    expect(auth.signOut).toHaveBeenCalled();
  });

  test("student dashboard renders messaging input", async () => {
    // Mock user logged in
    const { auth } = require("./components/firebase");
    auth.currentUser = { uid: "123" };

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    window.history.pushState({}, "Dashboard", "/student-dashboard");

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type message/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
    });
  });
});
