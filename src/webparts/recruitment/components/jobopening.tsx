import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./jobopening.module.scss";
import { useNavigate } from "react-router-dom";

interface IJobOpeningsProps {
  context: any;
}

const JobOpenings: React.FC<IJobOpeningsProps> = ({ context }) => {
  const navigate = useNavigate();

  // State
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const [formData, setFormData] = useState<any>({
    jobTitle: "",
    clientName: "",
    location: "",
    jobType: "Full-Time",
    openings: 1,
    postedDate: new Date().toLocaleDateString(),
    status: "Open",
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

  // Save new job
  const handleSubmit = () => {
    if (!formData.jobTitle || !formData.clientName) {
      alert("Job Title and Client Name are required!");
      return;
    }

    const newJob = { ...formData, id: jobs.length + 1 };
    setJobs([...jobs, newJob]);

    setFormData({
      jobTitle: "",
      clientName: "",
      location: "",
      jobType: "Full-Time",
      openings: 1,
      postedDate: new Date().toLocaleDateString(),
      status: "Open",
    });

    setShowForm(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Filter jobs
  const filteredJobs = jobs.filter(
    (j) =>
      j.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      j.clientName.toLowerCase().includes(search.toLowerCase())
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
              <li><button onClick={() => navigate("/clientonboarding")}>Clients</button></li>
              <li><button className={styles.active}>Job Openings</button></li>
              <li><button onClick={() => navigate("/candidates")}>Candidates</button></li>
              <li><button onClick={() => navigate("/approvals")}>Approvals</button></li>
              <li><button onClick={() => navigate("/interviews")}>Interviews</button></li>
              <li><button onClick={() => navigate("/reports")}>Reports</button></li>
              <li><button onClick={() => navigate("/admin")}>Admin</button></li>
            </ul>
          </nav>

          {/* Main Content */}
          <section className={styles.content}>
            <div className={styles.jobHeader}>
              <h2>Job Openings</h2>
            </div>

            {/* Search + Action button */}
            <div className={styles.searchRow}>
              <input
                type="text"
                placeholder="Search by job title or client..."
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className={styles.actionButton}
                onClick={() => setShowForm(true)}
              >
                + Add Job Opening
              </button>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Job Title</th>
                    <th>Client</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Openings</th>
                    <th>Posted Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((j) => (
                    <tr key={j.id}>
                      <td>{j.id}</td>
                      <td>{j.jobTitle}</td>
                      <td>{j.clientName}</td>
                      <td>{j.location}</td>
                      <td>{j.jobType}</td>
                      <td>{j.openings}</td>
                      <td>{j.postedDate}</td>
                      <td>{j.status}</td>
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
                <h2 className={styles.modalTitle}>📝 Job Opening Form</h2>
              </div>

              {/* Modal Form */}
              <form className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Job Title <span className={styles.required}>*</span></label>
                  <input
                    name="jobTitle"
                    placeholder="Enter job title"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

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
                  <label>Location</label>
                  <input
                    name="location"
                    placeholder="Enter job location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Job Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Number of Openings</label>
                  <input
                    type="number"
                    name="openings"
                    min="1"
                    value={formData.openings}
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
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="On Hold">On Hold</option>
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
            ✅ Job Opening added successfully!
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

export default JobOpenings;
