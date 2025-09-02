import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./dashboard.module.scss";

interface IDashboardProps {
  context: any;
}

const Dashboard: React.FC<IDashboardProps> = ({ context }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");

  // Dummy data
  const jobOpenings = [
    { id: 1, title: "Software Engineer", client: "ABC Corp", recruiter: "John Doe" },
    { id: 2, title: "HR Manager", client: "XYZ Ltd", recruiter: "Jane Smith" },
  ];

  const approvals = [
    { id: 1, candidate: "Alice", job: "Software Engineer", recruiter: "John Doe" },
    { id: 2, candidate: "Bob", job: "HR Manager", recruiter: "Jane Smith" },
  ];

  // Fetch current user info
  useEffect(() => {
    if (context?.pageContext?.user?.displayName) {
      setUserName(context.pageContext.user.displayName);
    }
  }, [context]);

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
              <li><button className={styles.active}>Dashboard</button></li>
              <li><button onClick={() => navigate("/roleassignment")}>Role Assignment</button></li>
              <li><button onClick={() => navigate("/clientonboarding")}>Clients</button></li>
              <li><button onClick={() => navigate("/jobopening")}>Job Openings</button></li>
              <li><button onClick={() => navigate("/candidates")}>Candidates</button></li>

              <li><button onClick={() => navigate("/interviews")}>Interviews</button></li>
              <li><button onClick={() => navigate("/reports")}>Reports</button></li>
              <li><button onClick={() => navigate("/admin")}>Admin</button></li>
            </ul>
          </nav>

          {/* Content */}
          <section className={styles.content}>
            <div className={styles.clientHeader}>
              <h2>Dashboard</h2>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.card}>
                <h3>24</h3>
                <p>Active Clients</p>
              </div>
              <div className={styles.card}>
                <h3>18</h3>
                <p>Job Openings</p>
              </div>
              <div className={styles.card}>
                <h3>142</h3>
                <p>Total Candidates</p>
              </div>
              <div className={styles.card}>
                <h3>9</h3>
                <p>Approvals Pending</p>
              </div>
            </div>

            {/* Job Openings Table */}
            <div className={styles.tableContainer}>
              <h3>Recent Job Openings</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Client</th>
                    <th>Recruiter</th>
                  </tr>
                </thead>
                <tbody>
                  {jobOpenings.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.client}</td>
                      <td>{job.recruiter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Approvals Table */}
            <div className={styles.tableContainer}>
              <h3>Pending Approvals</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Recruiter</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.map((a) => (
                    <tr key={a.id}>
                      <td>{a.candidate}</td>
                      <td>{a.job}</td>
                      <td>{a.recruiter}</td>
                      <td>
                        <button className={styles.actionButton}>Approve</button>
                        <button className={styles.cancelBtn}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          © 2025 Recruitment Hub. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
