import { getPayload } from "payload";
import config from "@payload-config";

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  source: string;
  createdAt: string;
};

type Application = {
  id: string;
  name: string;
  email: string;
  roleSlug: string;
  status: string;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  new: "#f59e0b",
  contacted: "#3b82f6",
  qualified: "#8b5cf6",
  won: "#10b981",
  lost: "#6b7280",
  reviewing: "#3b82f6",
  interview: "#8b5cf6",
  rejected: "#ef4444",
  hired: "#10b981",
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "#6b7280";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {status}
    </span>
  );
}

function StatTile({
  label,
  value,
  color,
  href,
}: {
  label: string;
  value: number;
  color: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid var(--theme-elevation-150, #e5e7eb)",
        textDecoration: "none",
        background: "var(--theme-elevation-0, #fff)",
        transition: "box-shadow .15s",
      }}
    >
      <p
        style={{
          fontSize: "28px",
          fontWeight: 700,
          margin: "0 0 4px",
          color,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "12px",
          fontWeight: 500,
          margin: 0,
          color: "var(--theme-elevation-500, #6b7280)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
    </a>
  );
}

function RecentTable({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--theme-elevation-150, #e5e7eb)",
        borderRadius: "10px",
        overflow: "hidden",
        background: "var(--theme-elevation-0, #fff)",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--theme-elevation-150, #e5e7eb)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, fontSize: "13px" }}>{title}</p>
        <a
          href={href}
          style={{ fontSize: "12px", color: "#6366f1", textDecoration: "none" }}
        >
          View all →
        </a>
      </div>
      <div style={{ overflowX: "auto" }}>{children}</div>
    </div>
  );
}

export default async function DashboardStats() {
  const payload = await getPayload({ config });
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { totalDocs: totalLeads },
    { totalDocs: newLeads },
    { totalDocs: unreadLeads },
    { totalDocs: totalApps },
    { totalDocs: newApps },
    recentLeads,
    recentApps,
  ] = await Promise.all([
    payload.count({ collection: "leads", overrideAccess: true }),
    payload.count({
      collection: "leads",
      where: { createdAt: { greater_than: sevenDaysAgo } },
      overrideAccess: true,
    }),
    payload.count({
      collection: "leads",
      where: { status: { equals: "new" } },
      overrideAccess: true,
    }),
    payload.count({ collection: "job-applications", overrideAccess: true }),
    payload.count({
      collection: "job-applications",
      where: { createdAt: { greater_than: sevenDaysAgo } },
      overrideAccess: true,
    }),
    payload.find({
      collection: "leads",
      limit: 6,
      sort: "-createdAt",
      overrideAccess: true,
    }),
    payload.find({
      collection: "job-applications",
      limit: 6,
      sort: "-createdAt",
      overrideAccess: true,
    }),
  ]);

  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: "13px",
    borderBottom: "1px solid var(--theme-elevation-100, #f3f4f6)",
    whiteSpace: "nowrap",
  };

  const thStyle: React.CSSProperties = {
    ...tdStyle,
    fontWeight: 600,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--theme-elevation-500, #6b7280)",
    background: "var(--theme-elevation-50, #f9fafb)",
  };

  return (
    <div style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid var(--theme-elevation-150, #e5e7eb)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontWeight: 700, fontSize: "16px", margin: 0 }}>Site Overview</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <a
            href="/api/export/leads"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #6366f1",
              color: "#6366f1",
              textDecoration: "none",
              background: "#6366f110",
            }}
          >
            ↓ Export Leads CSV
          </a>
          <a
            href="/api/export/applications"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #8b5cf6",
              color: "#8b5cf6",
              textDecoration: "none",
              background: "#8b5cf610",
            }}
          >
            ↓ Export Applications CSV
          </a>
        </div>
      </div>

      {/* Stats tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <StatTile label="Total Leads" value={totalLeads} color="#6366f1" href="/admin/collections/leads" />
        <StatTile label="Unread Leads" value={unreadLeads} color="#ef4444" href="/admin/collections/leads" />
        <StatTile label="New (7 days)" value={newLeads} color="#f59e0b" href="/admin/collections/leads" />
        <StatTile label="Applications" value={totalApps} color="#8b5cf6" href="/admin/collections/job-applications" />
        <StatTile label="New Apps (7d)" value={newApps} color="#10b981" href="/admin/collections/job-applications" />
      </div>

      {/* Recent tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <RecentTable title="Recent Leads" href="/admin/collections/leads">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Source</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentLeads.docs as unknown as Lead[]).map((lead) => (
                <tr key={lead.id}>
                  <td style={tdStyle}>
                    <a
                      href={`/admin/collections/leads/${lead.id}`}
                      style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}
                    >
                      {lead.name}
                    </a>
                    <br />
                    <span style={{ color: "var(--theme-elevation-500, #6b7280)", fontSize: "11px" }}>
                      {lead.email}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: "11px", color: "var(--theme-elevation-500, #6b7280)" }}>
                      {lead.source === "ai_chat" ? "AI Chat" : "Form"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td style={{ ...tdStyle, color: "var(--theme-elevation-500, #6b7280)", fontSize: "11px" }}>
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
              {recentLeads.docs.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--theme-elevation-500, #6b7280)" }}>
                    No leads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </RecentTable>

        <RecentTable title="Recent Applications" href="/admin/collections/job-applications">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Applicant</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentApps.docs as unknown as Application[]).map((app) => (
                <tr key={app.id}>
                  <td style={tdStyle}>
                    <a
                      href={`/admin/collections/job-applications/${app.id}`}
                      style={{ color: "#059669", textDecoration: "none", fontWeight: 500 }}
                    >
                      {app.name}
                    </a>
                    <br />
                    <span style={{ color: "var(--theme-elevation-500, #6b7280)", fontSize: "11px" }}>
                      {app.email}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: "11px", color: "var(--theme-elevation-500, #6b7280)" }}>
                    {app.roleSlug}
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={app.status} />
                  </td>
                  <td style={{ ...tdStyle, color: "var(--theme-elevation-500, #6b7280)", fontSize: "11px" }}>
                    {formatDate(app.createdAt)}
                  </td>
                </tr>
              ))}
              {recentApps.docs.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "var(--theme-elevation-500, #6b7280)" }}>
                    No applications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </RecentTable>
      </div>
    </div>
  );
}
