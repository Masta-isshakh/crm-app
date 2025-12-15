import { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customer";
import Tickets from "../pages/Tickets";
import Employees from "../pages/Employees";
import ActivityLog from "../pages/ActivityLogs";
import { getCurrentUser, GetCurrentUserOutput } from "@aws-amplify/auth";
import logo from "../assets/logo.jpeg"; // Add your logo here
import "./mainlayout.css";

interface Props {
  user: GetCurrentUserOutput | null;
  signOut: () => void;
}

export default function MainLayout({ signOut }: Props) {
  const [page, setPage] = useState<
    "dashboard" | "employees" | "customers" | "tickets" | "activitylogger"
  >("dashboard");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserEmail(user.signInDetails?.loginId || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUserEmail(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="layout-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Rodeo Drive CRM Logo" className="logo-img" />
          <span className="logo-text">Rodeo Drive CRM</span>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("employees")}>Employees</button>
          <button onClick={() => setPage("customers")}>Customers</button>
          <button onClick={() => setPage("tickets")}>Tickets</button>
          <button onClick={() => setPage("activitylogger")}>Activity Logger</button>
          <button onClick={signOut}>Sign out</button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="main-header">
          <h1>
            Welcome to the Rodeo Drive Admin page. Your email address is:{" "}
            {userEmail || "Loading user..."}
          </h1>
        </header>

        {page === "dashboard" && <Dashboard />}
        {page === "employees" && <Employees />}
        {page === "customers" && <Customers />}
        {page === "tickets" && <Tickets />}
        {page === "activitylogger" && <ActivityLog />}
      </main>
    </div>
  );
}
