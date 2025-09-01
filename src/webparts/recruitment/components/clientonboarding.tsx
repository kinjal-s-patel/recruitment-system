import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./clientonboarding.module.scss";
import { useNavigate } from "react-router-dom";

interface IClientOnboardingProps {
  context: any;
}

const ClientOnboarding: React.FC<IClientOnboardingProps> = ({ context }) => {
  const navigate = useNavigate();

  // State
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const [formData, setFormData] = useState<any>({
    clientName: "",
    contactPerson: "",
    email: "",
    phone: "",
    linkedin: "",
    address: "",
    onboardDate: new Date().toLocaleDateString(),
    status: "Active",
  });

  // Get current logged-in username from SharePoint context
  useEffect(() => {
    if (context?.pageContext?.user?.displayName) {
      setUserName(context.pageContext.user.displayName);
    }
  }, [context]);

  // Handle form input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save new client
  const handleSubmit = () => {
    if (!formData.clientName || !formData.email) {
      alert("Client Name and Email are required!");
      return;
    }

    const newClient = { ...formData, id: clients.length + 1 };
    setClients([...clients, newClient]);

    setFormData({
      clientName: "",
      contactPerson: "",
      email: "",
      phone: "",
      linkedin: "",
      address: "",
      onboardDate: new Date().toLocaleDateString(),
      status: "Active",
    });

    setShowForm(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Filter clients
  const filteredClients = clients.filter(
    (c) =>
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  // Hide SharePoint chrome
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #SuiteNavWrapper,
      #spSiteHeader,
      #spLeftNav,
      .spAppBar,
      .sp-appBar,
      .sp-appBar-mobile,
      div[data-automation-id="pageCommandBar"],
      div[data-automation-id="pageHeader"],
      div[data-automation-id="pageFooter"] {
        display: none !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        background: #fff !important;
      }

      #spPageCanvasContent, .CanvasComponent, .CanvasZone, .CanvasSection, .control-zone {
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        max-width: 100vw !important;
      }

      .ms-FocusZone {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

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
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.appName}>Recruitment Hub</h1>
          <div className={styles.userInfo}>{userName || "Loading..."}</div>
        </header>

        <div className={styles.mainContainer}>
          {/* Sidebar */}
          <nav className={styles.sidebar}>
            <ul>
              <li><button onClick={() => navigate("/")}>Dashboard</button></li>
              <li><button className={styles.active}>Clients</button></li>
              <li><button onClick={() => navigate("/jobopenings")}>Job Openings</button></li>
              <li><button onClick={() => navigate("/candidates")}>Candidates</button></li>
              <li><button onClick={() => navigate("/approvals")}>Approvals</button></li>
              <li><button onClick={() => navigate("/interviews")}>Interviews</button></li>
              <li><button onClick={() => navigate("/reports")}>Reports</button></li>
              <li><button onClick={() => navigate("/admin")}>Admin</button></li>
            </ul>
          </nav>

          {/* Main Content */}
          <section className={styles.content}>
            <div className={styles.clientHeader}>
              <h2>Client List</h2>
            </div>

            {/* Search + Action button */}
            <div className={styles.searchRow}>
              <input
                type="text"
                placeholder="Search by name or email..."
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className={styles.actionButton}
                onClick={() => setShowForm(true)}
              >
                + Add Client
              </button>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>LinkedIn</th>
                    <th>Contact Person</th>
                    <th>Onboard Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.clientName}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>{c.linkedin}</td>
                      <td>{c.contactPerson}</td>
                      <td>{c.onboardDate}</td>
                      <td>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>📝 Client Form</h2>
              </div>

              {/* Modal Form */}
              <form className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Client Name <span className={styles.required}>*</span></label>
                  <input
                    name="clientName"
                    placeholder="Enter client name"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Contact Person</label>
                  <input
                    name="contactPerson"
                    placeholder="Enter contact person"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email <span className={styles.required}>*</span></label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>LinkedIn</label>
                  <input
                    name="linkedin"
                    placeholder="Enter LinkedIn profile"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Footer Actions */}
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={styles.saveBtn}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className={styles.successPopup}>
            ✅ Client added successfully!
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          © 2025 Recruitment Hub. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ClientOnboarding;
