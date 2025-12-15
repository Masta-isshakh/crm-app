import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { Button, TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./employees.css";

const client = generateClient<Schema>();

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    email: "",
    phone: "",
    salary: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await client.models.Employee.list();
    setEmployees(data);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      position: "",
      email: "",
      phone: "",
      salary: "",
    });
    setEditingEmployee(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CREATE or UPDATE
  const handleSubmit = async () => {
    try {
      if (editingEmployee) {
        await client.models.Employee.update({
          id: editingEmployee.id,
          ...formData,
          salary: Number(formData.salary),
        });
      } else {
        await client.models.Employee.create({
          ...formData,
          salary: Number(formData.salary),
          createdAt: new Date().toISOString(),
        });
      }

      resetForm();
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position || "",
      email: employee.email,
      phone: employee.phone || "",
      salary: employee.salary?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this employee?")) return;
    await client.models.Employee.delete({ id });
    fetchEmployees();
  };

  return (
    <div className="employees-page">
      <div className="employees-header">
        <h2>Employees</h2>
        <Button variation="primary" onClick={() => setShowModal(true)}>
          Add Employee
        </Button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingEmployee ? "Edit Employee" : "New Employee"}</h3>

            <div className="form-grid">
              <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              <TextField label="Position" name="position" value={formData.position} onChange={handleChange} />
              <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <TextField label="Salary" name="salary" type="number" value={formData.salary} onChange={handleChange} />
            </div>

            <div className="modal-actions">
              <Button variation="link" onClick={() => { setShowModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button variation="primary" onClick={handleSubmit}>
                {editingEmployee ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYEES LIST */}
      <div className="employees-grid">
        {employees.map((e) => (
          <div className="employee-card" key={e.id}>
            <h4>{e.firstName} {e.lastName}</h4>
            <p className="position">{e.position || "Employee"}</p>
            <p>Email: {e.email}</p>
            <p>Phone: {e.phone || "N/A"}</p>
            <p>Salary: {e.salary ?? "N/A"}</p>

            <div className="card-actions">
              <Button size="small" onClick={() => handleEdit(e)}>Edit</Button>
              <Button size="small" variation="destructive" onClick={() => handleDelete(e.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
