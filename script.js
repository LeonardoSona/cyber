const GSK_COLORS = {
  brand: "#f36f21",
  brandStrong: "#dd5f17",
  plum: "#7a1f5c",
  violet: "#8b3f98",
  deepBlue: "#203864",
  teal: "#0f6f78",
  good: "#1f8a4c",
  warn: "#c97a00",
  bad: "#c0392b",
  grid: "#e7d9cb",
  text: "#5e5149",
  textStrong: "#2a1f1a",
  bgSoft: "#fff8f2"
};

const monthlyData = {
  q1: {
    labels: ["Jan", "Feb", "Mar"],
    riskScore: [68, 70, 72],
    criticalOpen: [10, 12, 14],
    cyberRating: [756, 749, 742],
    controlEffectiveness: 81,
    highRiskAssets: 37,
    remediated: 9,
    annualLoss: "$8.4M",
    delta: {
      risk: "+4 vs Dec",
      critical: "+2 vs Dec",
      control: "+3 pts",
      assets: "0 change",
      closed: "+4 vs prior qtr"
    }
  },
  jan: {
    labels: ["Jan"],
    riskScore: [68],
    criticalOpen: [10],
    cyberRating: [756],
    controlEffectiveness: 79,
    highRiskAssets: 34,
    remediated: 2,
    annualLoss: "$7.6M",
    delta: {
      risk: "Baseline",
      critical: "10 open",
      control: "79%",
      assets: "34 assets",
      closed: "2 closed"
    }
  },
  feb: {
    labels: ["Feb"],
    riskScore: [70],
    criticalOpen: [12],
    cyberRating: [749],
    controlEffectiveness: 80,
    highRiskAssets: 36,
    remediated: 3,
    annualLoss: "$8.0M",
    delta: {
      risk: "+2 vs Jan",
      critical: "+2 vs Jan",
      control: "+1 pt",
      assets: "+2 vs Jan",
      closed: "3 closed"
    }
  },
  mar: {
    labels: ["Mar"],
    riskScore: [72],
    criticalOpen: [14],
    cyberRating: [742],
    controlEffectiveness: 81,
    highRiskAssets: 37,
    remediated: 4,
    annualLoss: "$8.4M",
    delta: {
      risk: "+2 vs Feb",
      critical: "+2 vs Feb",
      control: "+1 pt",
      assets: "+1 vs Feb",
      closed: "4 closed"
    }
  }
};

const risks = [
  {
    id: "RISK-1042",
    title: "Legacy authentication on vendor-connected application",
    owner: "Enterprise Apps",
    domain: "Identity & Access",
    severity: "High",
    status: "In Progress",
    region: "EMEA",
    due: "15 Apr 2026",
    impact: "High",
    likelihood: "Medium"
  },
  {
    id: "RISK-1048",
    title: "Privileged accounts without enforced MFA",
    owner: "Identity Security",
    domain: "Identity & Access",
    severity: "High",
    status: "Open",
    region: "Global",
    due: "30 Apr 2026",
    impact: "High",
    likelihood: "High"
  },
  {
    id: "RISK-1054",
    title: "Critical internet-facing vulnerabilities overdue >30 days",
    owner: "Infrastructure",
    domain: "Vulnerability Management",
    severity: "High",
    status: "In Progress",
    region: "Americas",
    due: "22 Apr 2026",
    impact: "High",
    likelihood: "High"
  },
  {
    id: "RISK-1060",
    title: "Third-party access not recertified within policy window",
    owner: "Vendor Risk",
    domain: "Third-Party Risk",
    severity: "Medium",
    status: "Open",
    region: "Global",
    due: "10 May 2026",
    impact: "Medium",
    likelihood: "Medium"
  },
  {
    id: "RISK-1066",
    title: "Cloud logging gaps in regulated workloads",
    owner: "Cloud Platform",
    domain: "Cloud Security",
    severity: "Medium",
    status: "Closed",
    region: "APAC",
    due: "28 Apr 2026",
    impact: "Medium",
    likelihood: "Low"
  },
  {
    id: "RISK-1071",
    title: "Shared service accounts with inadequate ownership review",
    owner: "IAM Operations",
    domain: "Identity & Access",
    severity: "High",
    status: "Open",
    region: "EMEA",
    due: "08 May 2026",
    impact: "High",
    likelihood: "Medium"
  },
  {
    id: "RISK-1077",
    title: "Third-party support account monitoring is incomplete",
    owner: "Vendor Risk",
    domain: "Third-Party Risk",
    severity: "High",
    status: "In Progress",
    region: "Americas",
    due: "19 May 2026",
    impact: "High",
    likelihood: "Medium"
  }
];

const domainScores = {
  "Identity & Access": 84,
  "Third-Party Risk": 79,
  "Vulnerability Management": 76,
  "Cloud Security": 70,
  "Data Protection": 63,
  "Endpoint Security": 58
};

const controls = [
  { name: "MFA Coverage", value: 74, color: GSK_COLORS.warn },
  { name: "Privileged Access Reviews", value: 78, color: GSK_COLORS.warn },
  { name: "Critical Patch SLA", value: 69, color: GSK_COLORS.bad },
  { name: "Third-Party Access Recertification", value: 72, color: GSK_COLORS.warn },
  { name: "Logging & Detection Coverage", value: 88, color: GSK_COLORS.good }
];

const identityControls = [
  { name: "Privileged MFA Enforcement", value: 71, color: GSK_COLORS.bad },
  { name: "Role / Access Recertification", value: 73, color: GSK_COLORS.warn },
  { name: "Vendor Authentication Modernization", value: 68, color: GSK_COLORS.bad },
  { name: "Identity Monitoring Coverage", value: 84, color: GSK_COLORS.good }
];

function byId(id) {
  return document.getElementById(id);
}

function safeSetText(id, value) {
  const el = byId(id);
  if (el) el.textContent = value;
}

function safeSetHTML(id, value) {
  const el = byId(id);
  if (el) el.innerHTML = value;
}

function getSelectValue(id, fallback = "all") {
  const el = byId(id);
  if (!el) return fallback;
  return el.value || fallback;
}

function normalizeDateRangeValue(value) {
  if (!value) return "q1";
  const v = value.toLowerCase();
  if (v.includes("jan")) return "jan";
  if (v.includes("feb")) return "feb";
  if (v.includes("mar")) return "mar";
  return "q1";
}

function statusClass(status) {
  if (status === "Open") return "open";
  if (status === "In Progress" || status === "Mitigation In Progress" || status === "Planned" || status === "Assessment In Progress") return "progress";
  if (status === "Awaiting Approval") return "open";
  return "closed";
}

function severityClass(sev) {
  if (sev === "High") return "high";
  if (sev === "Medium") return "med";
  return "low";
}

function getFilteredRisks() {
  const domain = getSelectValue("domain", "All Domains");
  const region = getSelectValue("region", "Global");
  const severity = getSelectValue("severity", "All Severities");
  const owner = getSelectValue("owner", "All Owners");

  return risks.filter((r) => {
    const domainOk = domain === "All Domains" || domain === "all" || r.domain === domain;
    const regionOk = region === "Global" || region === "all" || r.region === region || r.region === "Global";
    const severityOk = severity === "All Severities" || severity === "all" || r.severity === severity;
    const ownerOk = owner === "All Owners" || owner === "all" || r.owner === owner;
    return domainOk && regionOk && severityOk && ownerOk;
  });
}

function getScopeKey() {
  return normalizeDateRangeValue(getSelectValue("dateRange", "q1"));
}

function lineChartSVG({
  labels,
  series,
  height = 300,
  width = 760,
  yMax = 100,
  title = ""
}) {
  const left = 70;
  const right = width - 50;
  const top = 36;
  const bottom = height - 55;

  const toPoints = (values) => {
    const step = labels.length === 1 ? 0 : (right - left) / (labels.length - 1);
    return values.map((v, i) => {
      const x = labels.length === 1 ? (left + right) / 2 : left + step * i;
      const y = bottom - ((v / yMax) * (bottom - top));
      return { x, y, value: v };
    });
  };

  const labelX = (i) =>
    labels.length === 1 ? (left + right) / 2 : left + (((right - left) / (labels.length - 1)) * i);

  const poly = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  const horizontalTicks = [0, 25, 50, 75, 100];

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" aria-label="${title}">
      <rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="transparent"></rect>

      <line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" stroke="${GSK_COLORS.grid}" stroke-width="1"/>
      <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="${GSK_COLORS.grid}" stroke-width="1"/>

      ${horizontalTicks.map((tick) => {
        const y = bottom - ((tick / yMax) * (bottom - top));
        return `
          <line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${GSK_COLORS.grid}" stroke-dasharray="4 4" />
          <text x="${left - 18}" y="${y + 4}" fill="${GSK_COLORS.text}" font-size="12" text-anchor="end">${tick}</text>
        `;
      }).join("")}

      ${labels.map((lbl, i) => `
        <text x="${labelX(i)}" y="${bottom + 24}" fill="${GSK_COLORS.text}" font-size="12" text-anchor="middle">${lbl}</text>
      `).join("")}

      ${series.map((s) => {
        const pts = toPoints(s.values);
        return `
          <polyline fill="none" stroke="${s.color}" stroke-width="4" points="${poly(pts)}" />
          ${pts.map((p) => `
            <circle cx="${p.x}" cy="${p.y}" r="5.5" fill="${s.color}" />
            <text x="${p.x}" y="${p.y - 12}" fill="${s.color}" font-size="12" text-anchor="middle">${p.value}</text>
          `).join("")}
        `;
      }).join("")}
    </svg>
  `;
}

function barChartSVG({ data, title = "", height = 320, width = 760 }) {
  const left = 70;
  const right = width - 30;
  const top = 30;
  const bottom = height - 50;
  const chartHeight = bottom - top;
  const barGap = 24;
  const barWidth = Math.min(72, (right - left) / Math.max(data.length, 1) - barGap);

  const maxValue = Math.max(...data.map((d) => d.value), 100);

  return `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" aria-label="${title}">
      <line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" stroke="${GSK_COLORS.grid}" stroke-width="1"/>
      <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="${GSK_COLORS.grid}" stroke-width="1"/>

      ${[0, 25, 50, 75, 100].map((tick) => {
        const y = bottom - ((tick / maxValue) * chartHeight);
        return `
          <line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${GSK_COLORS.grid}" stroke-dasharray="4 4" />
          <text x="${left - 16}" y="${y + 4}" fill="${GSK_COLORS.text}" font-size="12" text-anchor="end">${tick}</text>
        `;
      }).join("")}

      ${data.map((d, i) => {
        const step = (right - left) / data.length;
        const x = left + i * step + (step - barWidth) / 2;
        const barHeight = (d.value / maxValue) * chartHeight;
        const y = bottom - barHeight;
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="10" fill="${d.color}" />
          <text x="${x + barWidth / 2}" y="${y - 10}" fill="${GSK_COLORS.textStrong}" font-size="12" text-anchor="middle">${d.value}</text>
          <text x="${x + barWidth / 2}" y="${bottom + 18}" fill="${GSK_COLORS.text}" font-size="12" text-anchor="middle">${d.label}</text>
        `;
      }).join("")}
    </svg>
  `;
}

function heatMapSVG() {
  const cells = [
    ["Low", "Low", "Medium", "Medium", "High"],
    ["Low", "Medium", "Medium", "High", "High"],
    ["Medium", "Medium", "High", "High", "Critical"],
    ["Medium", "High", "High", "Critical", "Critical"],
    ["High", "High", "Critical", "Critical", "Critical"]
  ];

  const colorFor = (val) => {
    if (val === "Critical") return "#e9b4ac";
    if (val === "High") return "#f7ddba";
    if (val === "Medium") return "#f9efd2";
    return "#eef5ea";
  };

  let svg = `<svg viewBox="0 0 520 360" width="100%" height="320" aria-label="Risk heat map">`;
  svg += `<text x="260" y="24" text-anchor="middle" fill="${GSK_COLORS.deepBlue}" font-size="16" font-weight="700">Likelihood × Impact</text>`;

  const startX = 90;
  const startY = 55;
  const size = 55;

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const x = startX + col * size;
      const y = startY + row * size;
      svg += `
        <rect x="${x}" y="${y}" width="${size - 4}" height="${size - 4}" rx="10" fill="${colorFor(cells[4 - row][col])}" stroke="${GSK_COLORS.grid}" />
        <text x="${x + 25}" y="${y + 31}" text-anchor="middle" fill="${GSK_COLORS.textStrong}" font-size="11">${cells[4 - row][col]}</text>
      `;
    }
  }

  ["Very Low", "Low", "Medium", "High", "Very High"].forEach((label, i) => {
    svg += `<text x="${startX + i * size + 25}" y="338" text-anchor="middle" fill="${GSK_COLORS.text}" font-size="11">${label}</text>`;
  });

  ["Very High", "High", "Medium", "Low", "Very Low"].forEach((label, i) => {
    svg += `<text x="58" y="${startY + i * size + 30}" text-anchor="end" fill="${GSK_COLORS.text}" font-size="11">${label}</text>`;
  });

  svg += `<text x="260" y="355" text-anchor="middle" fill="${GSK_COLORS.text}" font-size="12">Impact</text>`;
  svg += `<text x="20" y="190" transform="rotate(-90,20,190)" text-anchor="middle" fill="${GSK_COLORS.text}" font-size="12">Likelihood</text>`;
  svg += `</svg>`;
  return svg;
}

function renderExecutivePage() {
  const scopeKey = getScopeKey();
  const data = monthlyData[scopeKey];
  if (!data) return;

  if (byId("executiveTrendChart")) {
    safeSetHTML("executiveTrendChart", lineChartSVG({
      labels: data.labels,
      series: [
        { values: data.riskScore, color: GSK_COLORS.brand },
        { values: data.criticalOpen.map(v => v * 5), color: GSK_COLORS.plum }
      ],
      title: "Executive risk trend"
    }));
  }
}

function renderRiskAnalyticsPage() {
  if (byId("riskByDomainChart")) {
    const selectedDomain = getSelectValue("domain", "All Domains");
    const entries = Object.entries(domainScores)
      .filter(([name]) => selectedDomain === "All Domains" || name === selectedDomain)
      .map(([label, value]) => ({
        label: label.replace(" & ", "/"),
        value,
        color:
          value >= 80 ? GSK_COLORS.bad :
          value >= 75 ? GSK_COLORS.brand :
          value >= 68 ? GSK_COLORS.warn :
          value >= 60 ? "#95b85d" :
          GSK_COLORS.good
      }));

    safeSetHTML("riskByDomainChart", barChartSVG({
      data: entries,
      title: "Risk by domain"
    }));
  }

  if (byId("riskHeatMap")) {
    safeSetHTML("riskHeatMap", heatMapSVG());
  }
}

function renderExposurePage() {
  if (byId("attackSurfaceTrendChart")) {
    const scopeKey = getScopeKey();
    const data = monthlyData[scopeKey];

    const labels = data.labels;
    const exposedAssets = scopeKey === "q1" ? [171, 176, 182] : [182];
    const credentials = scopeKey === "q1" ? [4, 5, 7] : [7];

    safeSetHTML("attackSurfaceTrendChart", lineChartSVG({
      labels,
      series: [
        { values: exposedAssets.map(v => Math.round(v / 2)), color: GSK_COLORS.brand },
        { values: credentials.map(v => v * 10), color: GSK_COLORS.plum }
      ],
      title: "Attack surface trend"
    }));
  }
}

function renderThirdPartyPage() {
  if (byId("vendorTrendChart")) {
    const scopeKey = getScopeKey();
    const data = monthlyData[scopeKey];
    const labels = data.labels;
    const vendorIssues = scopeKey === "q1" ? [11, 14, 17] : [17];
    const riskyVendors = scopeKey === "q1" ? [6, 8, 9] : [9];

    safeSetHTML("vendorTrendChart", lineChartSVG({
      labels,
      series: [
        { values: vendorIssues.map(v => v * 5), color: GSK_COLORS.violet },
        { values: riskyVendors.map(v => v * 10), color: GSK_COLORS.brand }
      ],
      title: "Vendor risk trend"
    }));
  }

  if (byId("vendorCategoryChart")) {
    safeSetHTML("vendorCategoryChart", barChartSVG({
      data: [
        { label: "Access", value: 81, color: GSK_COLORS.bad },
        { label: "Monitoring", value: 73, color: GSK_COLORS.warn },
        { label: "AppSec", value: 69, color: GSK_COLORS.brand },
        { label: "Network", value: 66, color: GSK_COLORS.teal }
      ],
      title: "Vendor category comparison"
    }));
  }
}

function renderDecisionSupportPage() {
  if (byId("scenarioComparisonChart")) {
    safeSetHTML("scenarioComparisonChart", barChartSVG({
      data: [
        { label: "Identity", value: 84, color: GSK_COLORS.bad },
        { label: "Ransomware", value: 72, color: GSK_COLORS.brand },
        { label: "3rd Party", value: 68, color: GSK_COLORS.violet },
        { label: "Cloud", value: 59, color: GSK_COLORS.teal }
      ],
      title: "Scenario comparison"
    }));
  }
}

function initLegacySinglePageSupport() {
  const filterEls = {
    dateRange: byId("dateRange"),
    domain: byId("domainFilter"),
    region: byId("regionFilter"),
    severity: byId("severityFilter")
  };

  function getLegacyFilteredRisks() {
    const domain = filterEls.domain ? filterEls.domain.value : "all";
    const region = filterEls.region ? filterEls.region.value : "all";
    const severity = filterEls.severity ? filterEls.severity.value : "all";

    return risks.filter((r) => {
      const domainOk = domain === "all" || r.domain === domain;
      const regionOk = region === "all" || r.region === region || r.region === "Global";
      const sevOk = severity === "all" || r.severity === severity;
      return domainOk && regionOk && sevOk;
    });
  }

  function renderLegacyTrendChart() {
    if (!byId("trendChart")) return;
    const scopeKey = filterEls.dateRange ? normalizeDateRangeValue(filterEls.dateRange.value) : "q1";
    const data = monthlyData[scopeKey];

    safeSetHTML("trendChart", lineChartSVG({
      labels: data.labels,
      series: [
        { values: data.riskScore, color: GSK_COLORS.brand },
        { values: data.criticalOpen.map(v => v * 5), color: GSK_COLORS.plum }
      ],
      title: "Risk trend"
    }));
  }

  function renderLegacyDomainList(selectedDomain) {
    const list = byId("domainList");
    if (!list) return;

    const entries = Object.entries(domainScores)
      .filter(([name]) => selectedDomain === "all" || name === selectedDomain);

    list.innerHTML = entries.map(([name, value]) => {
      const color =
        value >= 80 ? GSK_COLORS.bad :
        value >= 75 ? GSK_COLORS.brand :
        value >= 68 ? GSK_COLORS.warn :
        value >= 60 ? "#95b85d" : GSK_COLORS.good;

      return `
        <div class="domain-item">
          <div class="domain-top"><strong>${name}</strong><span>${value}</span></div>
          <div class="domain-bar"><div class="domain-fill" style="width:${value}%; background:${color};"></div></div>
        </div>
      `;
    }).join("");
  }

  function renderLegacyControlList(targetId, items) {
    const el = byId(targetId);
    if (!el) return;
    el.innerHTML = items.map(c => `
      <div class="domain-item">
        <div class="domain-top"><strong>${c.name}</strong><span>${c.value}%</span></div>
        <div class="domain-bar"><div class="domain-fill" style="width:${c.value}%; background:${c.color};"></div></div>
      </div>
    `).join("");
  }

  function renderLegacyRiskTable() {
    const body = byId("riskTableBody");
    if (!body) return;

    const rows = getLegacyFilteredRisks();
    body.innerHTML = rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.title}</td>
        <td>${r.owner}</td>
        <td>${r.domain}</td>
        <td><span class="pill ${severityClass(r.severity)}">${r.severity}</span></td>
        <td>${r.due}</td>
        <td><span class="status ${statusClass(r.status)}">${r.status}</span></td>
      </tr>
    `).join("");
  }

  function renderLegacyIdentityTable() {
    const body = byId("identityTableBody");
    if (!body) return;

    const rows = getLegacyFilteredRisks().filter(r => r.domain === "Identity & Access");
    body.innerHTML = rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.title}</td>
        <td>${r.owner}</td>
        <td>${r.region}</td>
        <td><span class="pill ${severityClass(r.severity)}">${r.severity}</span></td>
        <td>${r.due}</td>
        <td><span class="status ${statusClass(r.status)}">${r.status}</span></td>
      </tr>
    `).join("") || `<tr><td colspan="7">No identity risks match the current filters.</td></tr>`;
  }

  function renderLegacyNarratives() {
    const domain = filterEls.domain ? filterEls.domain.value : "all";
    const driversText =
      domain === "Identity & Access"
        ? "Identity remains the primary risk driver, with incomplete MFA coverage, legacy authentication on selected vendor-connected applications, and weak ownership review on shared privileged accounts."
        : domain === "Third-Party Risk"
        ? "Third-party risk remains elevated due to delayed recertification, inconsistent monitoring of partner-linked accounts, and incomplete validation of externally connected support access."
        : domain === "Vulnerability Management"
        ? "Residual risk is being driven by overdue critical vulnerabilities on externally exposed assets, where remediation pace has not fully matched exposure and exploitation pressure."
        : "Q1 risk increased mainly from identity and third-party access exposure, combined with a rise in overdue critical vulnerability treatment items.";

    safeSetText("narrativeDrivers", driversText);
    safeSetText(
      "narrativeImpact",
      "The current profile increases the likelihood of unauthorized access, delayed containment, and regulatory exposure for applications and datasets supporting sensitive operational or compliance-driven processes."
    );

    safeSetHTML("narrativeActions", [
      "Prioritize identity hardening for privileged and vendor-connected applications.",
      "Accelerate remediation of overdue critical issues linked to high-value assets.",
      "Use ServiceNow workflow to tighten ownership, recertification, and treatment accountability."
    ].map(a => `<li>${a}</li>`).join(""));

    safeSetText(
      "boardExposure",
      "Q1 ended with elevated residual risk concentrated in identity, third-party access, and selected critical remediation backlogs tracked through ServiceNow risk records."
    );
    safeSetText(
      "boardConcern",
      "The most material concern is the combination of valid-credential attack paths and external connectivity, where control gaps can translate quickly into business-impacting exposure."
    );
    safeSetText(
      "boardDecision",
      "Approve focused investment and executive sponsorship for identity modernization, critical remediation acceleration, and automated risk treatment workflow enforcement."
    );
  }

  function renderLegacyKPIs() {
    const scopeKey = filterEls.dateRange ? normalizeDateRangeValue(filterEls.dateRange.value) : "q1";
    const data = monthlyData[scopeKey];
    const filteredRisks = getLegacyFilteredRisks();
    const highCount = filteredRisks.filter(r => r.severity === "High" && r.status !== "Closed").length;
    const closedCount = filteredRisks.filter(r => r.status === "Closed").length;
    const assetCount = Math.max(8, filteredRisks.length * 4 + (scopeKey === "q1" ? 9 : 4));

    safeSetText(
      "kpiRiskScore",
      scopeKey === "q1"
        ? Math.round(data.riskScore.reduce((a, b) => a + b, 0) / data.riskScore.length)
        : data.riskScore[0]
    );
    safeSetText("kpiCriticalOpen", highCount);
    safeSetText("kpiControl", `${data.controlEffectiveness}%`);
    safeSetText("kpiAssets", assetCount);
    safeSetText("kpiClosed", Math.max(data.remediated, closedCount));

    safeSetText("kpiRiskDelta", data.delta.risk);
    safeSetText("kpiCriticalDelta", data.delta.critical);
    safeSetText("kpiControlDelta", data.delta.control);
    safeSetText("kpiAssetsDelta", data.delta.assets);
    safeSetText("kpiClosedDelta", data.delta.closed);
  }

  function renderLegacyIdentityMini() {
    const rows = getLegacyFilteredRisks().filter(r => r.domain === "Identity & Access");
    safeSetText("idMfaGap", Math.max(6, rows.length * 6));
    safeSetText("idVendorApps", Math.max(3, rows.length + 4));
    safeSetText("idControlScore", "74%");
  }

  function updateLegacyScopeText() {
    const scopeText = byId("activeScopeText");
    if (!scopeText || !filterEls.dateRange || !filterEls.domain || !filterEls.region || !filterEls.severity) return;

    const dateLabel = filterEls.dateRange.options[filterEls.dateRange.selectedIndex].text;
    const domainLabel = filterEls.domain.options[filterEls.domain.selectedIndex].text;
    const regionLabel = filterEls.region.options[filterEls.region.selectedIndex].text;
    const severityLabel = filterEls.severity.options[filterEls.severity.selectedIndex].text;

    scopeText.textContent = `Showing: ${dateLabel} | ${regionLabel} | ${domainLabel} | ${severityLabel}`;
  }

  function renderLegacyAll() {
    renderLegacyKPIs();
    renderLegacyTrendChart();
    renderLegacyDomainList(filterEls.domain ? filterEls.domain.value : "all");
    renderLegacyControlList("controlList", controls);
    renderLegacyControlList("identityControlList", identityControls);
    renderLegacyRiskTable();
    renderLegacyIdentityTable();
    renderLegacyNarratives();
    renderLegacyIdentityMini();
    updateLegacyScopeText();
  }

  const legacyTabButtons = document.querySelectorAll(".tab-btn");
  legacyTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      btn.classList.add("active");
      const target = byId(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });

  Object.values(filterEls).forEach(el => {
    if (el) el.addEventListener("change", renderLegacyAll);
  });

  if (
    byId("trendChart") ||
    byId("riskTableBody") ||
    byId("identityTableBody") ||
    byId("kpiRiskScore")
  ) {
    renderLegacyAll();
  }
}

function initPageFilters() {
  const filterIds = ["dateRange", "region", "domain", "severity", "owner", "businessUnit", "assetType", "criticality", "vendorTier", "assessmentStatus", "scenario", "investmentType", "audience"];
  filterIds.forEach((id) => {
    const el = byId(id);
    if (el) {
      el.addEventListener("change", renderApp);
    }
  });
}

function renderApp() {
  renderExecutivePage();
  renderRiskAnalyticsPage();
  renderExposurePage();
  renderThirdPartyPage();
  renderDecisionSupportPage();
}

document.addEventListener("DOMContentLoaded", () => {
  initPageFilters();
  initLegacySinglePageSupport();
  renderApp();
});