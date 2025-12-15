import { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customer";
import Tickets from "../pages/Tickets";
import { getCurrentUser, GetCurrentUserOutput } from "@aws-amplify/auth";



interface Props {
      user: GetCurrentUserOutput | null;

  signOut: () => void;
}

export default function MainLayout({ signOut }: Props) {
  const [page, setPage] = useState<"dashboard" | "customers" | "tickets">(
    "dashboard"
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        // Gen2: user.signInDetails.loginId contains the email
        setUserEmail(user.signInDetails?.loginId || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUserEmail(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 240, background: "#111827", color: "white" }}>
        <h2 style={{ padding: 16 }}>CRM</h2>
        <nav>
          <button
            style={{ display: "block", width: "100%", padding: "8px 16px" }}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
          <button
            style={{ display: "block", width: "100%", padding: "8px 16px" }}
            onClick={() => setPage("customers")}
          >
            Customers
          </button>
          <button
            style={{ display: "block", width: "100%", padding: "8px 16px" }}
            onClick={() => setPage("tickets")}
          >
            Tickets
          </button>
          <button
            style={{ display: "block", width: "100%", padding: "8px 16px" }}
            onClick={signOut}
          >
            Sign out
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <header>
          <h1>
            Welcome, {userEmail ? userEmail : "Loading user..."}
          </h1>
        </header>

        {page === "dashboard" && <Dashboard />}
        {page === "customers" && <Customers />}
        {page === "tickets" && <Tickets />}
      </main>
    </div>
  );
}
