import * as React from "react";
import {
  Stack,
  Text,
  SearchBox,
  PrimaryButton,
  DefaultButton,
  DetailsList,
  IColumn,
} from "@fluentui/react";
import styles from "./dashboard.module.scss";

interface IDashboardProps {
  context: any;
}

const Dashboard: React.FC<IDashboardProps> = () => {
  // Dummy data
  const jobOpenings = [
    { Title: "Software Engineer", Client: "ABC Corp", Recruiter: "John Doe" },
    { Title: "HR Manager", Client: "XYZ Ltd", Recruiter: "Jane Smith" },
  ];

  const approvals = [
    { Candidate: "Alice", Job: "Software Engineer", Recruiter: "John Doe" },
    { Candidate: "Bob", Job: "HR Manager", Recruiter: "Jane Smith" },
  ];

  // Columns
  const jobColumns: IColumn[] = [
    { key: "title", name: "Title", fieldName: "Title", minWidth: 150, isResizable: true },
    { key: "client", name: "Client", fieldName: "Client", minWidth: 150, isResizable: true },
    { key: "recruiter", name: "Recruiter", fieldName: "Recruiter", minWidth: 150, isResizable: true },
  ];

  const approvalColumns: IColumn[] = [
    { key: "candidate", name: "Candidate", fieldName: "Candidate", minWidth: 150, isResizable: true },
    { key: "job", name: "Job", fieldName: "Job", minWidth: 150, isResizable: true },
    { key: "recruiter", name: "Recruiter", fieldName: "Recruiter", minWidth: 150, isResizable: true },
    {
      key: "actions",
      name: "Actions",
      minWidth: 200,
      onRender: (item: any) => (
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <PrimaryButton text="Approve" />
          <DefaultButton text="Reject" />
        </Stack>
      ),
    },
  ];

  // Hide SharePoint chrome
  React.useEffect(() => {
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
      <div className={styles.wrapper}>
        <Stack horizontal className={styles.layout}>
          {/* Sidebar */}
          <Stack className={styles.sidebar} tokens={{ childrenGap: 20 }}>
            <Text className={styles.title}>Recruitment Hub</Text>

            {/* Navigation Items */}
            <Stack tokens={{ childrenGap: 12 }}>
              <div className={styles.navItem}><span>Dashboard</span></div>
              <div className={styles.navItem}> <span>Clients</span></div>
              <div className={styles.navItem}> <span>Job Openings</span></div>
              <div className={styles.navItem}> <span>Candidates</span></div>
              <div className={styles.navItem}> <span>Approvals</span></div>
              <div className={styles.navItem}> <span>Interviews</span></div>
              <div className={styles.navItem}> <span>Reports</span></div>
              <div className={styles.navItem}> <span>Admin</span></div>

            </Stack>
          </Stack>

          {/* Main Content */}
          <Stack grow className={styles.main} tokens={{ childrenGap: 25 }}>
            {/* Header */}
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: 600 } }}>
                Dashboard
              </Text>
              <SearchBox placeholder="Search..." />
            </Stack>

            {/* Stats Cards */}
            <Stack horizontal wrap tokens={{ childrenGap: 20 }}>
              <div className={styles.card}>
                <Text variant="xxLarge">24</Text>
                <Text>Active Clients</Text>
              </div>
              <div className={styles.card}>
                <Text variant="xxLarge">18</Text>
                <Text>Job Openings</Text>
              </div>
              <div className={styles.card}>
                <Text variant="xxLarge">142</Text>
                <Text>Total Candidates</Text>
              </div>
              <div className={styles.card}>
                <Text variant="xxLarge">9</Text>
                <Text>Approvals Pending</Text>
              </div>
            </Stack>

            {/* Tables Section */}
            <Stack horizontal wrap tokens={{ childrenGap: 30 }}>
              <Stack grow>
                <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                  Recent Job Openings
                </Text>
                <DetailsList items={jobOpenings} columns={jobColumns} />
              </Stack>

              <Stack grow>
                <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                  Pending Approvals
                </Text>
                <DetailsList items={approvals} columns={approvalColumns} />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default Dashboard;
