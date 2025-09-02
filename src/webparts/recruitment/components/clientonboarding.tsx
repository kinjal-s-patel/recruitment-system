import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { spfi, SPFI } from "@pnp/sp";
import { SPFx } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from "./clientonboarding.module.scss";

interface IClientOnboardingProps {
  context: any;
}

const ClientOnboarding: React.FC<IClientOnboardingProps> = ({ context }) => {
  const navigate = useNavigate();
  const sp: SPFI = spfi().using(SPFx(context));

  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [nextId, setNextId] = useState(1);

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [formData, setFormData] = useState<any>({
    clientid: "",
    clientname: "",
    contactperson: "",
    email: "",
    phonenumber: "",
    linkdin: "",
    address: "",
    onboarddate: todayStr,
    status: "Active",
  });

  // Get current logged-in username
  useEffect(() => {
    if (context?.pageContext?.user?.displayName) {
      setUserName(context.pageContext.user.displayName);
    }
  }, [context]);

  // Pad utility
  const pad = (num: number, size: number) => {
    let s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
  };

  // Fetch clients from SharePoint
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const spClients: any[] = await sp.web.lists
          .getByTitle("clients")
          .items.select(
            "ID",
            "clientid",
            "clientname",
            "contactperson",
            "email",
            "phonenumber",
            "linkdin",
            "address",
            "onboarddate",
            "status"
          )();

        setClients(spClients);

        // Compute next client ID
        let maxId = 0;
        spClients.forEach((c) => {
          const idNum = parseInt(c.clientid?.split("-")[1]);
          if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
        });
        setNextId(maxId + 1);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  }, [sp]);

  // Open form & auto-generate clientId
  const handleAddClient = () => {
    const clientid = `CLI-${pad(nextId, 3)}`;
    setFormData({
      clientid,
      clientname: "",
      contactperson: "",
      email: "",
      phonenumber: "",
      linkdin: "",
      address: "",
      onboarddate: todayStr,
      status: "Active",
    });
    setShowForm(true);
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Submit form to SharePoint
  const handleSubmit = async () => {
    if (!formData.clientname.trim() || !formData.email.trim()) {
      alert("Client Name and Email are required!");
      return;
    }

    try {
      await sp.web.lists.getByTitle("clients").items.add({
        clientid: formData.clientid,
        clientname: formData.clientname,
        contactperson: formData.contactperson,
        email: formData.email,
        phonenumber: formData.phonenumber,
        linkdin: formData.linkdin,
        address: formData.address,
        onboarddate: formData.onboarddate,
        status: formData.status,
      });

      // Update local state
      setClients([...clients, formData]);
      setNextId(nextId + 1);

      setFormData({
        clientid: "",
        clientname: "",
        contactperson: "",
        email: "",
        phonenumber: "",
        linkdin: "",
        address: "",
        onboarddate: todayStr,
        status: "Active",
      });

      setShowForm(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Failed to save client. Make sure you have permission.");
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.clientname?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
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
      <header className={styles.header}>
        <h1 className={styles.appName}>Recruitment Hub</h1>
        <div className={styles.userInfo}>{userName || "Loading..."}</div>
      </header>

      <div className={styles.mainContainer}>
        <nav className={styles.sidebar}>
          <ul>
            <li><button onClick={() => navigate("/")}>Dashboard</button></li>
               <li><button onClick={() => navigate("/roleassignment")}>Role Assignment</button></li>
            <li><button className={styles.active}>Clients</button></li>
            <li><button onClick={() => navigate("/jobopening")}>Job Openings</button></li>
            <li><button onClick={() => navigate("/candidates")}>Candidates</button></li>
         
            <li><button onClick={() => navigate("/interviews")}>Interviews</button></li>
            <li><button onClick={() => navigate("/reports")}>Reports</button></li>
            <li><button onClick={() => navigate("/admin")}>Admin</button></li>
          </ul>
        </nav>

        <section className={styles.content}>
          <div className={styles.clientHeader}><h2>Client List</h2></div>

          <div className={styles.searchRow}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.actionButton} onClick={handleAddClient}>
              + Add Client
            </button>
          </div>

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
                  <tr key={c.clientid}>
                    <td>{c.clientid}</td>
                    <td>{c.clientname}</td>
                    <td>{c.email}</td>
                    <td>{c.phonenumber}</td>
                    <td>{c.linkdin}</td>
                    <td>{c.contactperson}</td>
                    <td>{c.onboarddate}</td>
                    <td>{c.status}</td>
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
            <div className={styles.modalHeader}><h2>📝 Client Form</h2></div>
            <div className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Client ID</label>
                <input value={formData.clientid} readOnly />
              </div>
              <div className={styles.formGroup}>
                <label>Client Name *</label>
                <input name="clientname" value={formData.clientname} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Contact Person</label>
                <input name="contactperson" value={formData.contactperson} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input name="phonenumber" value={formData.phonenumber} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>LinkedIn</label>
                <input name="linkdin" value={formData.linkdin} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button onClick={handleSubmit} className={styles.saveBtn}>Save</button>
                <button onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && <div className={styles.successPopup}>✅ Client added successfully!</div>}

      <footer className={styles.footer}>© 2025 Recruitment Hub. All rights reserved.</footer>
    </div>
    </div>
  );
};

export default ClientOnboarding;
