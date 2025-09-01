import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./jobopening.module.scss";
import { useNavigate } from "react-router-dom";
import { spfi, SPFI } from "@pnp/sp";
import { SPFx } from "@pnp/sp/presets/all"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

interface IJobOpeningsProps {
  context: any;
}

const JobOpenings: React.FC<IJobOpeningsProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp: SPFI = spfi().using(SPFx(context));

  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [nextId, setNextId] = useState(1);

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [formData, setFormData] = useState<any>({
    jobtitle: "",
    client: "",
    location: "",
    jobtype: "Full-Time",
    numberofopenings: 1,
    date: todayStr,
    status: "Open",
  });

  // Pad number for job ID
  const pad = (num: number, size: number) => {
    let s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
  };

  // Get current user's display name
  useEffect(() => {
    if (context?.pageContext?.user?.displayName) {
      setUserName(context.pageContext.user.displayName);
    }
  }, [context]);

  // Fetch jobs from SharePoint on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const spJobs: any[] = await sp.web.lists.getByTitle("Job Openings").items.select(
          "ID", "jobid", "jobtitle", "client", "location", "jobtype", "numberofopenings", "date", "status"
        )();

        setJobs(spJobs);

        // Compute nextId based on last jobid
        let maxId = 0;
        spJobs.forEach(j => {
          const idNum = parseInt(j.jobid?.split("-")[1]);
          if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
        });
        setNextId(maxId + 1);

      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, [sp]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit new job
  const handleSubmit = async () => {
    if (!formData.jobtitle.trim() || !formData.client.trim()) {
      alert("Job Title and Client Name are required!");
      return;
    }

    const jobId = `JOB-${pad(nextId, 3)}`;
    const newJob = { ...formData, jobid: jobId };

    try {
      // Add to SharePoint list
      await sp.web.lists.getByTitle("Job Openings").items.add({
        jobid: jobId,
        jobtitle: formData.jobtitle,
        client: formData.client,
        location: formData.location,
        jobtype: formData.jobtype,
        numberofopenings: Number(formData.numberofopenings),
        date: formData.date,
        status: formData.status,
      });

      // Update local state
      setJobs([...jobs, newJob]);
      setNextId(nextId + 1);

      // Reset form
      setFormData({
        jobtitle: "",
        client: "",
        location: "",
        jobtype: "Full-Time",
        numberofopenings: 1,
        date: todayStr,
        status: "Open",
      });

      setShowForm(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

    } catch (error) {
      console.error("Error saving job to SharePoint:", error);
      alert("Failed to save job. Make sure you have permission.");
    }
  };

  // Filtered jobs for search
  const filteredJobs = jobs.filter(
    (j) =>
      j.jobtitle.toLowerCase().includes(search.toLowerCase()) ||
      j.client.toLowerCase().includes(search.toLowerCase())
  );

  // Hide SharePoint default chrome for full-page app
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #SuiteNavWrapper, #spSiteHeader, #spLeftNav, .spAppBar,
      .sp-appBar, .sp-appBar-mobile, div[data-automation-id="pageCommandBar"],
      div[data-automation-id="pageHeader"], div[data-automation-id="pageFooter"] {
        display: none !important; height: 0 !important; overflow: hidden !important;
      }
      html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; overflow:hidden !important; background:#fff !important; }
      #spPageCanvasContent, .CanvasComponent, .CanvasZone, .CanvasSection, .control-zone {
        width:100vw !important; height:100vh !important; margin:0 !important; padding:0 !important; overflow:hidden !important; max-width:100vw !important;
      }
      .ms-FocusZone { overflow:hidden !important; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "auto", backgroundColor: "#fff", position: "fixed", top: 0, left: 0, zIndex: 9999 }}>
      <div className={styles.dashboardWrapper}>
        <header className={styles.header}>
          <h1 className={styles.appName}>Recruitment Hub</h1>
          <div className={styles.userInfo}>{userName || "Loading..."}</div>
        </header>

        <div className={styles.mainContainer}>
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

          <section className={styles.content}>
            <div className={styles.jobHeader}><h2>Job Openings</h2></div>
            <div className={styles.searchRow}>
              <input type="text" placeholder="Search by job title or client..." value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} />
              <button className={styles.actionButton} onClick={() => setShowForm(true)}>+ Add Job Opening</button>
            </div>

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
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((j, idx) => (
                    <tr key={idx}>
                      <td>{j.jobid}</td>
                      <td>{j.jobtitle}</td>
                      <td>{j.client}</td>
                      <td>{j.location}</td>
                      <td>{j.jobtype}</td>
                      <td>{j.numberofopenings}</td>
                      <td>{j.date}</td>
                      <td>{j.status}</td>
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
              <div className={styles.modalHeader}><h2>📝 Job Opening Form</h2></div>
              <form className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Job ID</label>
                  <input type="text" value={`JOB-${pad(nextId,3)}`} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label>Job Title *</label>
                  <input name="jobtitle" value={formData.jobtitle} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Client Name *</label>
                  <input name="client" value={formData.client} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Job Type</label>
                  <select name="jobtype" value={formData.jobtype} onChange={handleChange}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Openings</label>
                  <input type="number" name="numberofopenings" min={1} value={formData.numberofopenings} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" onClick={handleSubmit} className={styles.saveBtn}>Save</button>
                  <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSuccessMessage && <div className={styles.successPopup}>✅ Job Opening added successfully!</div>}

        <footer className={styles.footer}>© 2025 Recruitment Hub. All rights reserved.</footer>
      </div>
    </div>
  );
};

export default JobOpenings;
