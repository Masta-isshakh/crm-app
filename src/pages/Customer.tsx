import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { Button, TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await client.models.Customer.list();
    setCustomers(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.lastname) {
      alert("First name and last name are required");
      return;
    }

    try {
      await client.models.Customer.create({
        name: formData.name,
        company: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
      });

      setFormData({ name: "", lastname: "", email: "", phone: "" });
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer");
    }
  };

  return (
    <div>
      <h2>Customers</h2>
      <Button variation="primary" onClick={() => setShowModal(true)}>
        Add Customer
      </Button>

      {/* Modal */}
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Create New Customer</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <TextField
                label="First Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button variation="link" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variation="primary" onClick={handleSubmit}>
                  Create Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer List */}
      <ul style={{ marginTop: 20 }}>
        {customers.map((c) => (
          <li key={c.id}>
            {c.name} {c.lastname} – {c.email} – {c.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Simple inline modal styles
const modalStyles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    width: 400,
    maxWidth: "90%",
  },
};
