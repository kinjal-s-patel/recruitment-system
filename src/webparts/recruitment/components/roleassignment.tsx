import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { spfi, SPFI } from "@pnp/sp";
import { SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from "./roleassignment.module.scss";

interface IRoleAssignmentProps {
  context: any;
}

const RoleAssignment: React.FC<IRoleAssignmentProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp: SPFI = spfi().using(SPFx(context));

  const [roles, setRoles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [formData, setFormData] = useState<any>({
    employeeName: "",
    role: "Recruiter",
    email: "",
    description: "",
    status: "Active",
    assignedDate: todayStr,
  });

  // Get current logged-in username
  useEffect(() => {
    if (context?.pageContext?.user?.displayName) {
      setUserName(context.pageContext.user.displayName);
    }
  }, [context]);

  // Fetch roles from SharePoint
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const spRoles: any[] = await sp.web.lists
          .getByTitle("roles")
          .items.select(
            "ID",
            "employeeName",
            "role",
            "email",
            "description",
            "status",
            "assignedDate"
          )();
        setRoles(spRoles);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, [sp]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Open form for Add or Edit
  const handleAddRole = () => {
    setFormData({
      employeeName: "",
      role: "Recruiter",
      email: "",
      description: "",
      status: "Active",
      assignedDate: todayStr,
    });
    setEditingRoleId(null);
    setShowForm(true);
  };

  const handleEditRole = (role: any) => {
    setFormData({
      employeeName: role.employeeName,
      role: role.role,
      email: role.email,
      description: role.description,
      status: role.status,
      assignedDate: role.assignedDate,
    });
    setEditingRoleId(role.ID);
    setShowForm(true);
  };

  // Submit form to SharePoint
  const handleSubmit = async () => {
    if (!formData.employeeName.trim() || !formData.role.trim()) {
      alert("Employee Name and Role are required!");
      return;
    }

    try {
      if (editingRoleId) {
        // Update existing role
        await sp.web.lists.getByTitle("roles").items.getById(editingRoleId).update({
          employeeName: formData.employeeName,
          role: formData.role,
          email: formData.email,
          description: formData.description,
          status: formData.status,
          assignedDate: formData.assignedDate,
        });

        setRoles(
          roles.map((r) => (r.ID === editingRoleId ? { ...r, ...formData } : r))
        );
      } else {
        // Add new role
        const addResult = await sp.web.lists.getByTitle("roles").items.add({
          employeeName: formData.employeeName,
          role: formData.role,
          email: formData.email,
          description: formData.description,
          status: formData.status,
          assignedDate: formData.assignedDate,
        });

        setRoles([...roles, { ID: addResult.data.ID, ...formData }]);
      }

      setFormData({
        employeeName: "",
        role: "Recruiter",
        email: "",
        description: "",
        status: "Active",
        assignedDate: todayStr,
      });
      setEditingRoleId(null);
      setShowForm(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error("Error saving role:", err);
      alert("Failed to save role. Make sure you have permission.");
    }
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      r.role?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "auto",
        backgroundColor: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <div className={styles.dashboardWrapper}>
        <header className={styles.header}>
          <h1 className={styles.appName}>Recruitment Hub</h1>
          <div className={styles.userInfo}>{userName || "Loading..."}</div>
        </header>

        <div className={styles.mainContainer}>
          <nav className={styles.sidebar}>
            <ul>
              <li>
                <button onClick={() => navigate("/")}>Dashboard</button>
              </li>
              <li>
                <button className={styles.active}>Role Assignment</button>
              </li>
              <li>
                <button onClick={() => navigate("/clientonboarding")}>Clients</button>
              </li>
              <li>
                <button onClick={() => navigate("/jobopening")}>Job Openings</button>
              </li>
              <li>
                <button onClick={() => navigate("/candidates")}>Candidates</button>
              </li>
              <li>
                <button onClick={() => navigate("/interviews")}>Interviews</button>
              </li>
              <li>
                <button onClick={() => navigate("/reports")}>Reports</button>
              </li>
              <li>
                <button onClick={() => navigate("/admin")}>Admin</button>
              </li>
            </ul>
          </nav>

          <section className={styles.content}>
            <div className={styles.clientHeader}>
              <h2>Role Assignments</h2>
            </div>

            <div className={styles.searchRow}>
              <input
                type="text"
                placeholder="Search by employee, role, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button className={styles.actionButton} onClick={handleAddRole}>
                + Add Role
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Assigned Date</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((r) => (
                    <tr key={r.ID}>
                      <td>{r.ID}</td>
                      <td>{r.employeeName}</td>
                      <td>{r.role}</td>
                      <td>{r.email}</td>     
                      <td>{r.assignedDate}</td>
                      <td>{r.status}</td>
                      <td>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditRole(r)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {showForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>📝 Role Assignment Form</h2>
              </div>
              <div className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Employee Name *</label>
                  <input
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Recruiter">Recruiter</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button onClick={handleSubmit} className={styles.saveBtn}>
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingRoleId(null);
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className={styles.successPopup}>✅ Role saved successfully!</div>
        )}

        <footer className={styles.footer}>
          © 2025 Recruitment Hub. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default RoleAssignment;
