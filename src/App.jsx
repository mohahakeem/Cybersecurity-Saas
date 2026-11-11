import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cloud,
  Command,
  Download,
  Ellipsis,
  FileWarning,
  Filter,
  GitBranch,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  Network,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

const initialAlerts = [
  { id: 1, title: "Exposed admin panel detected", asset: "api.northstar.io", type: "Misconfiguration", severity: "Critical", time: "8 min ago", icon: Globe2 },
  { id: 2, title: "Outdated OpenSSL version", asset: "payments-service · 10.0.4.28", type: "Vulnerability", severity: "High", time: "24 min ago", icon: Terminal },
  { id: 3, title: "Unusual sign-in from new location", asset: "j.morrison@northstar.io", type: "Identity", severity: "Medium", time: "1 hour ago", icon: LockKeyhole },
  { id: 4, title: "Public S3 bucket permissions", asset: "northstar-customer-uploads", type: "Cloud posture", severity: "High", time: "2 hours ago", icon: Cloud },
  { id: 5, title: "SQL injection risk in search endpoint", asset: "api.northstar.io/v2/search", type: "Vulnerability", severity: "Critical", time: "3 hours ago", icon: Terminal },
  { id: 6, title: "MFA not enabled for service account", asset: "deploy-bot@northstar.io", type: "Identity", severity: "High", time: "4 hours ago", icon: LockKeyhole },
  { id: 7, title: "TLS certificate expires soon", asset: "staging.northstar.io", type: "Configuration", severity: "Medium", time: "5 hours ago", icon: Globe2 },
  { id: 8, title: "Container running as root", asset: "worker-pool · us-east-1", type: "Cloud posture", severity: "High", time: "Yesterday", icon: Cloud },
  { id: 9, title: "Unpatched Linux kernel detected", asset: "prod-worker-03 · 10.0.2.16", type: "Vulnerability", severity: "Medium", time: "Yesterday", icon: Terminal },
  { id: 10, title: "New OAuth application authorized", asset: "j.morrison@northstar.io", type: "Identity", severity: "Medium", time: "Yesterday", icon: LockKeyhole },
  { id: 11, title: "Database accepts public connections", asset: "northstar-analytics-db", type: "Misconfiguration", severity: "Critical", time: "Nov 8, 2026", icon: Network },
  { id: 12, title: "Weak cipher suite enabled", asset: "vpn.northstar.io", type: "Configuration", severity: "High", time: "Nov 8, 2026", icon: Globe2 },
];

const scans = [
  { name: "Production environment", detail: "42 assets · Full infrastructure scan", date: "Today, 9:42 AM", duration: "4m 18s", status: "Completed", score: "94%" },
  { name: "Web application scan", detail: "northstar.io · OWASP Top 10", date: "Today, 8:16 AM", duration: "2m 06s", status: "Completed", score: "88%" },
  { name: "Cloud configuration", detail: "AWS · 3 accounts", date: "Yesterday, 6:30 PM", duration: "6m 52s", status: "Completed", score: "91%" },
];

const chartData = [34, 41, 38, 48, 44, 53, 47, 59, 54, 64, 58, 69, 63, 74, 67, 77, 70, 82, 73, 86, 78, 91, 82, 95];

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark"><Shield size={20} strokeWidth={2.2} /><span /></div>
      <span>Katongo-Tech<span className="brand-dot">.</span></span>
    </div>
  );
}

function Sidebar({ active, onNavigate }) {
  const groups = [
    { label: "WORKSPACE", items: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Assets", icon: Network, count: "42" },
      { name: "Vulnerabilities", icon: ShieldAlert, count: "12", highlight: true },
      { name: "Scan history", icon: Activity },
    ] },
    { label: "MANAGE", items: [
      { name: "Integrations", icon: GitBranch },
      { name: "Team & access", icon: LockKeyhole },
    ] },
  ];

  return (
    <aside className="sidebar">
      <Logo />
      <button className="workspace-switch">
        <div className="workspace-avatar">N</div>
        <span className="workspace-copy"><strong>Katongo-Tech Labs</strong><small>Pro workspace</small></span>
        <ChevronDown size={15} />
      </button>
      <nav className="side-nav">
        {groups.map((group) => (
          <div className="nav-group" key={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.items.map(({ name, icon: Icon, count, highlight }) => (
              <button key={name} onClick={() => onNavigate(name)} className={`nav-item ${active === name ? "active" : ""}`}>
                <Icon size={17} strokeWidth={1.8} />
                <span>{name}</span>
                {count && <span className={`nav-count ${highlight ? "alert-count" : ""}`}>{count}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="trial-card">
          <div className="trial-top"><span className="trial-icon"><Sparkles size={14} /></span><span>PRO PLAN</span></div>
          <strong>Your workspace is protected</strong>
          <div className="trial-meter"><span /></div>
          <small>34 of 50 assets monitored</small>
          <button onClick={() => onNavigate("Plans & billing")}>Manage plan <ArrowRight size={13} /></button>
        </div>
        <button className="nav-item support-link" onClick={() => onNavigate("Help & support")}><CircleHelp size={17} /><span>Help & support</span></button>
        <button className="profile-button" onClick={() => onNavigate("Account settings")}>
          <div className="profile-avatar">MH</div>
          <span className="profile-copy"><strong>Mohammed Hakeem</strong><small>Security Admin</small></span>
          <Ellipsis size={18} />
        </button>
      </div>
    </aside>
  );
}

function Severity({ level }) {
  return <span className={`severity severity-${level.toLowerCase()}`}><i />{level}</span>;
}

function TrendChart() {
  const line = chartData.map((value, i) => `${(i / (chartData.length - 1)) * 100},${100 - value}`).join(" ");
  const area = `0,100 ${line} 100,100`;
  return (
    <div className="chart-area">
      <div className="chart-grid">
        <div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
        <div className="chart-plot">
          <div className="grid-lines"><i /><i /><i /><i /><i /></div>
          <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Security score improving from 72 to 94 over the last 30 days">
            <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0d806d" stopOpacity=".18" /><stop offset="100%" stopColor="#0d806d" stopOpacity="0" /></linearGradient></defs>
            <polygon points={area} fill="url(#chartFill)" />
            <polyline points={line} fill="none" stroke="#0d806d" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="100" cy={100 - chartData[chartData.length - 1]} r="2" fill="#0d806d" stroke="white" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="chart-x-labels"><span>Oct 12</span><span>Oct 17</span><span>Oct 22</span><span>Oct 27</span><span>Nov 1</span><span>Nov 10</span></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = useState("Overview");
  const [alertFilter, setAlertFilter] = useState("All alerts");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Last 30 days");
  const [scanning, setScanning] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);
  const filteredAlerts = useMemo(() => alerts.filter((alert) => {
    const matchesSearch = `${alert.title} ${alert.asset} ${alert.type}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = alertFilter === "All alerts" || alert.severity === alertFilter;
    return matchesSearch && matchesFilter;
  }), [alerts, alertFilter, search]);
  const pageCount = Math.max(1, Math.ceil(filteredAlerts.length / 4));
  const pageAlerts = filteredAlerts.slice((page - 1) * 4, page * 4);
  const firstAlert = filteredAlerts.length ? (page - 1) * 4 + 1 : 0;
  const lastAlert = Math.min(page * 4, filteredAlerts.length);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    notify("Security scan started. We’ll notify you when it’s complete.");
    window.setTimeout(() => setScanning(false), 3500);
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={(name) => {
        setActive(name);
        if (name !== "Overview") notify(`${name} view selected`);
      }} />
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{active}</strong></div>
          <div className="topbar-actions">
            <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search anything..." /><kbd><Command size={10} /> K</kbd></label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify("You’re all caught up")}><Bell size={18} /><i /></button>
            <div className="top-divider" />
            <div className="user-mini"><div className="profile-avatar">MH</div><ChevronDown size={14} /></div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div><p className="eyebrow"><span className="live-dot" /> SECURITY OVERVIEW <span className="eyebrow-date">· MONDAY, NOVEMBER 10, 2026</span></p>
              <h1>Good morning, Mohammed <span className="wave">✳</span></h1>
              <p className="welcome-subtitle">Here’s what’s happening across your security posture today.</p></div>
            <div className="welcome-actions">
              <button className="button button-outline" onClick={() => notify("Your security report is being prepared")}><Download size={15} /> Export report</button>
              <button className="button button-primary" onClick={startScan}><Plus size={16} /> {scanning ? "Scanning..." : "Run a scan"}</button>
            </div>
          </section>

          <section className="stat-grid" aria-label="Security statistics">
            <article className="stat-card">
              <div className="stat-heading"><span>Security score</span><span className="stat-icon mint"><ShieldCheck size={17} /></span></div>
              <div className="stat-main"><strong>94</strong><span className="stat-denom">/100</span><span className="trend positive"><ArrowUpRight size={14} /> 6.2%</span></div>
              <div className="stat-foot"><span className="mini-bars">{[35, 48, 39, 61, 53, 67, 56, 76, 63, 88, 75, 100].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</span><span>vs. last month</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-heading"><span>Open vulnerabilities</span><span className="stat-icon coral"><FileWarning size={17} /></span></div>
              <div className="stat-main"><strong>12</strong><span className="trend positive"><ArrowDownRight size={14} /> 18%</span></div>
              <div className="stat-foot"><div className="severity-stack"><i /><i /><i /><i /></div><span>3 critical · 4 high · 5 medium</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-heading"><span>Assets monitored</span><span className="stat-icon lavender"><Network size={17} /></span></div>
              <div className="stat-main"><strong>42</strong><span className="trend neutral"><ArrowUpRight size={14} /> 3</span></div>
              <div className="stat-foot"><span className="foot-dot" /> All assets reporting normally</div>
            </article>
            <article className="stat-card">
              <div className="stat-heading"><span>Mean time to remediate</span><span className="stat-icon sand"><Clock3 size={17} /></span></div>
              <div className="stat-main"><strong>2.4</strong><span className="stat-unit">days</span><span className="trend positive"><ArrowDownRight size={14} /> 12%</span></div>
              <div className="stat-foot"><span className="foot-dot" /> Down from 2.8 days last month</div>
            </article>
          </section>

          <section className="content-grid">
            <article className="panel posture-panel">
              <div className="panel-header"><div><h2>Security posture</h2><p>Your security score over time</p></div>
                <label className="select-wrap"><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select><ChevronDown size={13} /></label>
              </div>
              <div className="chart-summary"><strong>94<span>/100</span></strong><span className="trend positive"><ArrowUpRight size={13} /> 6.2%</span><small>compared to previous period</small></div>
              <TrendChart />
              <div className="chart-legend"><span><i /> Security score</span><span className="chart-target"><i /> Target score: 90</span></div>
            </article>

            <article className="panel breakdown-panel">
              <div className="panel-header"><div><h2>Risk breakdown</h2><p>Open findings by severity</p></div><button className="icon-button small-icon" onClick={() => notify("Risk breakdown options")} aria-label="Risk breakdown options"><Ellipsis size={18} /></button></div>
              <div className="risk-total"><strong>12</strong><span>total findings</span><span className="risk-period">+2 this week</span></div>
              <div className="risk-list">
                <div className="risk-row"><span><i className="risk-dot critical" />Critical</span><div className="risk-bar"><i style={{ width: "60%" }} /></div><strong>3</strong></div>
                <div className="risk-row"><span><i className="risk-dot high" />High</span><div className="risk-bar"><i style={{ width: "82%" }} /></div><strong>4</strong></div>
                <div className="risk-row"><span><i className="risk-dot medium" />Medium</span><div className="risk-bar"><i style={{ width: "100%" }} /></div><strong>5</strong></div>
              </div>
              <button className="text-link" onClick={() => setActive("Vulnerabilities")}>View all vulnerabilities <ArrowRight size={14} /></button>
            </article>
          </section>

          <section className="panel alerts-panel">
            <div className="panel-header alerts-heading"><div><div className="title-inline"><h2>Recent alerts</h2><span className="alert-total">{filteredAlerts.length}</span></div><p>Events that need your attention</p></div>
              <div className="alert-controls"><div className="filter-control"><Filter size={14} /><select aria-label="Filter alerts" value={alertFilter} onChange={(event) => { setAlertFilter(event.target.value); setPage(1); }}><option>All alerts</option><option>Critical</option><option>High</option><option>Medium</option></select><ChevronDown size={12} /></div><button className="text-link" onClick={() => setActive("Alerts")}>View all <ArrowRight size={14} /></button></div>
            </div>
            <div className="alert-table-wrap"><table className="alert-table"><thead><tr><th>ALERT</th><th>TYPE</th><th>SEVERITY</th><th>DETECTED</th><th aria-label="Actions" /></tr></thead>
              <tbody>{filteredAlerts.length ? pageAlerts.map((alert) => {
                const Icon = alert.icon;
                return <tr key={alert.id}><td><div className="alert-name"><span className="alert-icon"><Icon size={16} /></span><span><strong>{alert.title}</strong><small>{alert.asset}</small></span></div></td><td><span className="type-label">{alert.type}</span></td><td><Severity level={alert.severity} /></td><td className="time-cell">{alert.time}</td><td><button className="row-action" aria-label={`Dismiss ${alert.title}`} onClick={() => { setAlerts((current) => current.filter((item) => item.id !== alert.id)); notify("Alert dismissed"); }}><X size={15} /></button></td></tr>;
              }) : <tr><td className="empty-alerts" colSpan="5">No alerts match your search.</td></tr>}</tbody>
              </table></div>
            <div className="panel-footer"><span>Showing <strong>{firstAlert}–{lastAlert}</strong> of {filteredAlerts.length} alerts</span><div className="pagination"><button aria-label="Previous page" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}><ChevronLeft size={15} /></button><button className="current-page" aria-current="page">{page}</button><button aria-label="Next page" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount}><ChevronRight size={15} /></button></div></div>
          </section>

          <section className="panel scans-panel">
            <div className="panel-header"><div><h2>Recent scans</h2><p>Latest activity across your environments</p></div><button className="text-link" onClick={() => setActive("Scan history")}>Scan history <ArrowRight size={14} /></button></div>
            <div className="scan-list">{scans.map((scan) => <div className="scan-row" key={scan.name}><span className="scan-status"><Check size={14} /></span><div className="scan-details"><strong>{scan.name}</strong><small>{scan.detail}</small></div><span className="scan-score">{scan.score}</span><span className="scan-duration">{scan.duration}</span><span className="scan-date">{scan.date}</span><span className="complete-tag">Completed</span><button className="row-action" aria-label={`View ${scan.name}`} onClick={() => notify(`${scan.name} details opened`)}><ArrowRight size={15} /></button></div>)}</div>
          </section>

          <footer className="page-footer"><span><span className="live-dot" /> All systems operational</span><span>Last updated just now <button onClick={() => notify("Dashboard refreshed")} aria-label="Refresh dashboard"><Activity size={13} /></button></span></footer>
        </div>
      </main>
      {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
    </div>
  );
}

export default App;
