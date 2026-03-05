import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import AttachIcon from "@diligentcorp/atlas-react-bundle/icons/Attach";
import SendIcon from "@diligentcorp/atlas-react-bundle/icons/Send";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import VirusFoundIcon from "@diligentcorp/atlas-react-bundle/icons/VirusFound";
import WarningIcon from "@diligentcorp/atlas-react-bundle/icons/Warning";
import RiskControlsIcon from "@diligentcorp/atlas-react-bundle/icons/RiskControls";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";

import TriageReportPanel from "../components/investigation/TriageReportPanel.js";
import NotificationPreviewPanel, {
  type Stakeholder,
} from "../components/investigation/NotificationPreviewPanel.js";
import RemediationPlanPanel, {
  type RemediationTicket,
} from "../components/investigation/RemediationPlanPanel.js";
import WorkflowStatusPanel, {
  type PhaseInfo,
  type PhaseStatus,
} from "../components/investigation/WorkflowStatusPanel.js";
import StepPreviewPanel from "../components/investigation/StepPreviewPanel.js";
import ChatMessage from "../components/investigation/ChatMessage.js";

// ─── Data ────────────────────────────────────────────────────────────────────

const recommendedStakeholders: Stakeholder[] = [
  { id: "1", name: "Sarah Chen", title: "Chief Information Security Officer", department: "Information Security", initials: "SC", reason: "Owns the enterprise security program and CVE response process" },
  { id: "2", name: "Michael Torres", title: "General Counsel", department: "Legal", initials: "MT", reason: "Required for SEC materiality assessment (8-K / 10-K)" },
  { id: "3", name: "Priya Sharma", title: "VP of Infrastructure", department: "IT Operations", initials: "PS", reason: "Owns payment processing and customer data platform servers" },
  { id: "4", name: "James Whitfield", title: "Director of Compliance", department: "GRC", initials: "JW", reason: "Manages SOC 2, ISO 27001, and PCI DSS control frameworks" },
  { id: "5", name: "Angela Martinez", title: "IT Risk Manager", department: "Risk & Audit", initials: "AM", reason: "Maintains the IT risk register and vulnerability management program" },
];

const additionalStakeholders: Stakeholder[] = [
  { id: "6", name: "David Park", title: "VP of Engineering", department: "Engineering", initials: "DP", reason: "Oversees application development teams" },
  { id: "7", name: "Rachel Kim", title: "Chief Audit Executive", department: "Internal Audit", initials: "RK", reason: "Leads internal audit and assurance" },
  { id: "8", name: "Tom Bradley", title: "Head of HR Systems", department: "Human Resources", initials: "TB", reason: "Owns internal HR portal infrastructure" },
];

const remediationTickets: RemediationTicket[] = [
  { id: "ITSM-4821", title: "Patch CrowdStrike Falcon Sensor — Payment processing cluster", system: "Payment processing cluster", assets: "4 production servers (PROD-PAY-01–04)", priority: "Critical", owner: "Priya Sharma", ownerInitials: "PS", dueDate: "Tomorrow, 6:00 AM", status: "Open", patchWindow: "Tonight 2:00–4:00 AM (maintenance window)" },
  { id: "ITSM-4822", title: "Patch CrowdStrike Falcon Sensor — Customer data platform", system: "Customer data platform", assets: "5 production servers (PROD-CDP-01–05)", priority: "Critical", owner: "Priya Sharma", ownerInitials: "PS", dueDate: "Tomorrow, 6:00 AM", status: "Open", patchWindow: "Tonight 4:00–6:00 AM (maintenance window)" },
  { id: "ITSM-4823", title: "Patch CrowdStrike Falcon Sensor — Internal HR portal", system: "Internal HR portal", assets: "3 servers (HR-WEB-01, HR-APP-01, STG-HR-01)", priority: "High", owner: "Tom Bradley", ownerInitials: "TB", dueDate: "Mar 6, 12:00 PM", status: "Open", patchWindow: "Tomorrow 10:00 AM–12:00 PM" },
  { id: "ITSM-4824", title: "Governance remediation — Update failed control documentation", system: "GRC platform", assets: "4 control records across SOC 2, ISO, NIST, PCI", priority: "High", owner: "James Whitfield", ownerInitials: "JW", dueDate: "Mar 7, 5:00 PM", status: "Open", patchWindow: "N/A — Documentation task" },
  { id: "ITSM-4825", title: "Risk register update — Recalculate residual risk scores", system: "Risk Manager", assets: "2 risk register entries (IR-2024-017, IR-2024-003)", priority: "Medium", owner: "Angela Martinez", ownerInitials: "AM", dueDate: "Mar 7, 5:00 PM", status: "Open", patchWindow: "N/A — Risk assessment task" },
];

const failedControls = [
  { control: "CC6.1 — Logical and physical access controls", policy: "Access Control Policy v2", framework: "SOC 2 Type II" },
  { control: "CC7.2 — System monitoring and anomaly detection", policy: "Security Monitoring Policy", framework: "SOC 2 Type II" },
  { control: "A.12.6.1 — Management of technical vulnerabilities", policy: "Vulnerability Management Policy", framework: "ISO 27001:2022" },
  { control: "Req 6.3.3 — Patch critical vulnerabilities", policy: "Patch Management Standard", framework: "PCI DSS v4.0" },
];

const relatedThreats = [
  { threat: "External ransomware via endpoint agent compromise", category: "Threat — Active exploit" },
  { threat: "Unauthorized access to payment card data", category: "Threat — Data exfiltration" },
  { threat: "Third-party supply chain compromise", category: "Threat — Vendor risk" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type ChatStep =
  | "triage"
  | "selecting-stakeholders"
  | "notify-sent"
  | "remediating";

type RightPanel =
  | "status"
  | "triage-report"
  | "notification-preview"
  | "remediation-plan"
  | "third-party-review"
  | "resolution"
  | "board-briefing";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function overallStatus(phases: Record<string, PhaseStatus>): "not-started" | "in-progress" | "complete" {
  const vals = Object.values(phases);
  if (vals.every((v) => v === "complete")) return "complete";
  if (vals.every((v) => v === "not-started")) return "not-started";
  return "in-progress";
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IncidentInvestigationPage() {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Phase completion state
  const [phases, setPhases] = useState<Record<string, PhaseStatus>>({
    notify: "not-started",
    remediation: "not-started",
    thirdParty: "not-started",
    resolution: "not-started",
    boardBriefing: "not-started",
  });
  const [phaseTimestamps, setPhaseTimestamps] = useState<Record<string, string>>({});

  // Chat progression + right panel view
  const [chatStep, setChatStep] = useState<ChatStep>("triage");
  const [rightPanel, setRightPanel] = useState<RightPanel>("triage-report");

  // Notify step state
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(recommendedStakeholders.map((s) => s.id)),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sentAt, setSentAt] = useState<string | null>(null);

  // Remediation step state
  const [remediationStartedAt, setRemediationStartedAt] = useState<string | null>(null);

  const allStakeholders = [...recommendedStakeholders, ...additionalStakeholders];
  const selectedStakeholders = allStakeholders.filter((s) => selected.has(s.id));
  const filteredAdditional = additionalStakeholders.filter(
    (s) =>
      !selected.has(s.id) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatStep]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function toggleStakeholder(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addStakeholder(id: string) {
    setSelected((prev) => new Set(prev).add(id));
    setSearchQuery("");
  }

  function handleNotifyClick() {
    setPhases((p) => ({ ...p, notify: "in-progress" }));
    setChatStep("selecting-stakeholders");
    setRightPanel("notification-preview");
  }

  function handleSendNotifications() {
    const ts = formatTimestamp();
    setSentAt(ts);
    setPhases((p) => ({ ...p, notify: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, notify: ts }));
    setChatStep("notify-sent");
    setRightPanel("status");
  }

  function handleInitiateRemediation() {
    const ts = formatTimestamp();
    setRemediationStartedAt(ts);
    setPhases((p) => ({ ...p, remediation: "in-progress" }));
    setPhaseTimestamps((t) => ({ ...t, remediation: ts }));
    setChatStep("remediating");
    setRightPanel("status");
  }

  function handleViewPhaseDetail(key: string) {
    if (key === "notify") setRightPanel("notification-preview");
    else if (key === "remediation") setRightPanel("remediation-plan");
    else if (key === "triage") setRightPanel("triage-report");
    else if (key === "thirdParty") setRightPanel("third-party-review");
    else if (key === "resolution") setRightPanel("resolution");
    else if (key === "boardBriefing") setRightPanel("board-briefing");
  }

  function handleStartThirdPartyReview() {
    const ts = formatTimestamp();
    setPhases((p) => ({ ...p, thirdParty: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, thirdParty: ts }));
    setRightPanel("status");
  }

  function handleCompleteResolution() {
    const ts = formatTimestamp();
    setPhases((p) => ({ ...p, resolution: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, resolution: ts }));
    setRightPanel("status");
  }

  function handleSendBoardBriefing() {
    const ts = formatTimestamp();
    setPhases((p) => ({ ...p, boardBriefing: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, boardBriefing: ts }));
    setRightPanel("status");
  }

  function handleShowStatus() {
    setRightPanel("status");
  }

  // ─── Build phase info for status panel ─────────────────────────────────────

  const phaseInfos: PhaseInfo[] = [
    {
      key: "triage",
      label: "Automated triage",
      status: "complete",
      completedAt: "Today, 2:15 PM",
      summary: "Cross-referenced 12 assets against policies, compliance frameworks, risk register, and known threats.",
      items: [
        { label: "Assets affected", detail: "12 across 3 systems" },
        { label: "Frameworks", detail: "SOC 2, ISO 27001, NIST CSF, PCI DSS" },
        { label: "Risk level", detail: "Critical — Likely material" },
      ],
    },
    {
      key: "notify",
      label: "Notify stakeholders",
      status: phases.notify,
      completedAt: phaseTimestamps.notify ? `Today, ${phaseTimestamps.notify}` : undefined,
      summary:
        phases.notify === "complete"
          ? `Context-aware notifications sent to ${selectedStakeholders.length} stakeholders.`
          : phases.notify === "in-progress"
            ? "Selecting stakeholders for notification..."
            : "Route context-aware alerts to asset owners, CISO, and General Counsel.",
      items:
        phases.notify === "complete"
          ? [
              { label: "Recipients", detail: `${selectedStakeholders.length} stakeholders` },
              { label: "Sent at", detail: phaseTimestamps.notify ?? "" },
            ]
          : undefined,
    },
    {
      key: "remediation",
      label: "Remediation",
      status: phases.remediation,
      completedAt: phaseTimestamps.remediation ? `Today, ${phaseTimestamps.remediation}` : undefined,
      summary:
        phases.remediation !== "not-started"
          ? `${remediationTickets.length} ITSM tickets created. Patching sequence optimized by criticality.`
          : "Create ITSM tickets, link failed controls, and coordinate patching schedule.",
      items:
        phases.remediation !== "not-started"
          ? [
              { label: "Tickets", detail: `${remediationTickets.length} created` },
              { label: "Controls linked", detail: `${failedControls.length} failed controls` },
              { label: "Threats linked", detail: `${relatedThreats.length} related threats` },
            ]
          : undefined,
    },
    {
      key: "thirdParty",
      label: "Third-party review",
      status: phases.thirdParty,
      completedAt: phaseTimestamps.thirdParty ? `Today, ${phaseTimestamps.thirdParty}` : undefined,
      summary:
        phases.thirdParty === "complete"
          ? "Vendor assessment documented; CrowdStrike record and SLAs reviewed."
          : "Assess CrowdStrike vendor record, SLAs, and compensating controls.",
    },
    {
      key: "resolution",
      label: "Resolution",
      status: phases.resolution,
      completedAt: phaseTimestamps.resolution ? `Today, ${phaseTimestamps.resolution}` : undefined,
      summary:
        phases.resolution === "complete"
          ? "Incident closed; patches verified, tickets closed, evidence pack compiled."
          : "Verify patches deployed, close tickets, compile evidence pack.",
    },
    {
      key: "boardBriefing",
      label: "Board briefing",
      status: phases.boardBriefing,
      completedAt: phaseTimestamps.boardBriefing ? `Today, ${phaseTimestamps.boardBriefing}` : undefined,
      summary:
        phases.boardBriefing === "complete"
          ? "Board notification sent; executive summary delivered to audit/risk committee."
          : "Generate executive summary for audit/risk committee review.",
    },
  ];

  // ─── Overall status ────────────────────────────────────────────────────────

  const incident = overallStatus({ triage: "complete" as PhaseStatus, ...phases });

  const statusChip =
    incident === "complete" ? (
      <StatusIndicator icon={<CheckedCircleIcon />} label="Complete" size="small" color="success" />
    ) : incident === "in-progress" ? (
      <StatusIndicator label="In progress" size="small" color="warning" />
    ) : (
      <StatusIndicator label="Not started" size="small" color="subtle" />
    );

  // ─── Right panel ───────────────────────────────────────────────────────────

  let rightPanelContent: React.ReactNode;
  if (rightPanel === "status") {
    rightPanelContent = (
      <WorkflowStatusPanel
        phases={phaseInfos}
        onViewPhaseDetail={handleViewPhaseDetail}
      />
    );
  } else if (rightPanel === "triage-report") {
    rightPanelContent = (
      <TriageReportPanel
        onBack={handleShowStatus}
        onNotifyStakeholders={() => {
          handleNotifyClick();
        }}
      />
    );
  } else if (rightPanel === "notification-preview") {
    rightPanelContent = (
      <NotificationPreviewPanel
        recipients={selectedStakeholders}
        sent={phases.notify === "complete"}
        sentAt={sentAt ?? undefined}
        onBack={handleShowStatus}
        onSend={handleSendNotifications}
      />
    );
  } else if (rightPanel === "remediation-plan") {
    rightPanelContent = (
      <RemediationPlanPanel
        tickets={remediationTickets}
        failedControls={failedControls}
        relatedThreats={relatedThreats}
        onBack={handleShowStatus}
        onInitiateRemediation={handleInitiateRemediation}
        remediationStarted={phases.remediation !== "not-started"}
      />
    );
  } else if (rightPanel === "third-party-review") {
    rightPanelContent = (
      <StepPreviewPanel
        title="Third-party review"
        description="Assess CrowdStrike vendor record, SLAs, and compensating controls. This step will document the vendor assessment and any follow-up actions."
        summary="Review vendor security posture and contract terms related to this incident."
        ctaLabel="Start third-party review"
        onCtaClick={handleStartThirdPartyReview}
        completed={phases.thirdParty === "complete"}
        completedAt={phaseTimestamps.thirdParty ? `Today, ${phaseTimestamps.thirdParty}` : undefined}
        onBack={handleShowStatus}
      />
    );
  } else if (rightPanel === "resolution") {
    rightPanelContent = (
      <StepPreviewPanel
        title="Resolution"
        description="Verify patches deployed, close ITSM tickets, and compile the evidence pack for audit. Confirm all remediation tickets are resolved and controls are restored."
        summary="Formally close the incident once remediation is verified."
        ctaLabel="Mark resolution complete"
        onCtaClick={handleCompleteResolution}
        completed={phases.resolution === "complete"}
        completedAt={phaseTimestamps.resolution ? `Today, ${phaseTimestamps.resolution}` : undefined}
        onBack={handleShowStatus}
      />
    );
  } else if (rightPanel === "board-briefing") {
    rightPanelContent = (
      <StepPreviewPanel
        title="Board briefing"
        description="Generate an executive summary for the audit and risk committee. The briefing will include incident timeline, impact, remediation status, and any materiality or disclosure considerations."
        summary="Prepare and send the board notification package."
        ctaLabel="Send board notification"
        onCtaClick={handleSendBoardBriefing}
        completed={phases.boardBriefing === "complete"}
        completedAt={phaseTimestamps.boardBriefing ? `Today, ${phaseTimestamps.boardBriefing}` : undefined}
        onBack={handleShowStatus}
      />
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const notifyDone = phases.notify === "complete";
  const remediationStarted = phases.remediation !== "not-started";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Top bar */}
      <Box
        sx={{
          backgroundColor: tokens.semantic.color.surface.default.value,
          borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          px: 3,
          py: 1.5,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton size="small" onClick={() => navigate("/")}>
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={600}>
              Security incident: CVE-2026-1847
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {statusChip}
            <Button
              variant={rightPanel === "status" ? "contained" : "outlined"}
              size="small"
              onClick={handleShowStatus}
            >
              Status
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Two-panel content */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left: Chat panel */}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          }}
        >
          <Box sx={{ flex: 1, overflow: "auto", px: 3, py: 3 }}>
            <Stack spacing={3}>
              {/* === Triage messages (always visible) === */}
              <ChatMessage timestamp="Today, 2:14 PM" status="done" title="Incident detected" icon={<VirusFoundIcon />}>
                <Typography variant="textSm">
                  I've detected a critical vulnerability <strong>CVE-2026-1847</strong> (CVSS 9.8)
                  affecting CrowdStrike Falcon Sensor across your environment. Active exploit
                  activity has been confirmed by your threat intelligence feed.
                </Typography>
                <Typography variant="textSm" sx={{ mt: 1 }}>
                  I'm starting the automated contextual triage now. This will cross-reference
                  affected assets against your policies, compliance frameworks, risk register,
                  and known threats.
                </Typography>
              </ChatMessage>

              <ChatMessage timestamp="2:14 PM" status="done" title="Asset scan complete">
                <Typography variant="textSm">
                  I've scanned your <strong>Asset Manager</strong> and identified{" "}
                  <strong>12 IT assets</strong> across <strong>3 business-critical systems</strong>{" "}
                  running the affected CrowdStrike Falcon Sensor version.
                </Typography>
                <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                  <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>Affected systems</Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="textSm">· <strong>Payment processing cluster</strong> — 4 servers (production)</Typography>
                    <Typography variant="textSm">· <strong>Customer data platform</strong> — 5 servers (production)</Typography>
                    <Typography variant="textSm">· <strong>Internal HR portal</strong> — 3 servers (staging + production)</Typography>
                  </Stack>
                </Box>
              </ChatMessage>

              <ChatMessage timestamp="2:15 PM" status="done" title="Compliance framework analysis" icon={<RiskControlsIcon />}>
                <Typography variant="textSm">
                  I've cross-referenced the affected assets against your compliance frameworks and risk register. Here's what's implicated:
                </Typography>
                <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                  <Stack spacing={1}>
                    {[["SOC 2", "CC6.1 (Logical access), CC7.2 (System monitoring)"], ["ISO 27001", "A.12.6.1 (Technical vulnerability management)"], ["NIST CSF", "ID.RA-1 (Asset vulnerabilities identified)"], ["PCI DSS", "Req 6.3.3 (Patch critical vulnerabilities)"]].map(([fw, ctrl]) => (
                      <Stack key={fw} direction="row" spacing={1} alignItems="center">
                        <Chip label={fw} size="small" variant="outlined" />
                        <Typography variant="textSm">{ctrl}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </ChatMessage>

              <ChatMessage timestamp="2:15 PM" status="done" title="Risk assessment" icon={<WarningIcon />}>
                <Typography variant="textSm">Based on the triage analysis, here is the initial risk assessment:</Typography>
                <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, border: `1px solid ${tokens.semantic.color.status.error.default.value}`, backgroundColor: tokens.semantic.color.status.error.background.value }}>
                  <Stack spacing={0.75}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="textSm" fontWeight={600}>Inherent risk score</Typography>
                      <Chip label="Critical" size="small" color="error" />
                    </Stack>
                    <Typography variant="textSm">
                      Active exploit + production payment systems + PCI scope = <strong>likely material</strong>.
                      Recommend escalation to CISO and General Counsel for materiality review.
                    </Typography>
                  </Stack>
                </Box>
              </ChatMessage>

              <Divider />

              {/* === Triage action buttons === */}
              {chatStep === "triage" && (
                <ChatMessage timestamp="2:16 PM" title="What would you like to do next?" isAction>
                  <Typography variant="textSm">The automated triage is complete. I recommend these next steps:</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                    <Button variant="contained" size="small" onClick={handleNotifyClick}>Notify stakeholders</Button>
                    <Button variant="outlined" size="small">Adjust risk assessment</Button>
                    <Button variant="outlined" size="small">View full asset details</Button>
                  </Stack>
                </ChatMessage>
              )}

              {/* === Stakeholder selection === */}
              {chatStep !== "triage" && (
                <>
                  <ChatMessage
                    timestamp="2:16 PM"
                    status={notifyDone ? "done" : "in-progress"}
                    title="Notify stakeholders"
                  >
                    <Typography variant="textSm">
                      I've identified the stakeholders who should be notified based on asset
                      ownership, compliance responsibilities, and the organizational chart.
                    </Typography>
                    <Typography variant="textSm" sx={{ mt: 1 }}>
                      Review the recommended recipients below. You can add or remove stakeholders before sending.
                    </Typography>
                  </ChatMessage>

                  <Box>
                    <Paper variant="outlined" sx={{ borderRadius: tokens.semantic.radius.lg.value, overflow: "hidden" }}>
                      <Box sx={{ px: 2.5, py: 1.5, backgroundColor: tokens.semantic.color.surface.variant.value, borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}` }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="textSm" fontWeight={600}>Recommended stakeholders</Typography>
                          <Chip label={`${selected.size} selected`} size="small" variant="outlined" />
                        </Stack>
                      </Box>
                      <Stack divider={<Divider />}>
                        {recommendedStakeholders.map((s) => (
                          <StakeholderRow key={s.id} stakeholder={s} checked={selected.has(s.id)} onChange={() => toggleStakeholder(s.id)} disabled={notifyDone} />
                        ))}
                      </Stack>
                      {!notifyDone && (
                        <Box sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${tokens.semantic.color.outline.fixed.value}`, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                          <TextField
                            size="small" placeholder="Search to add stakeholder..." fullWidth value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            slotProps={{ input: { startAdornment: <SearchIcon style={{ fontSize: 18, marginRight: 8, color: tokens.semantic.color.type.muted.value }} /> } }}
                          />
                          {searchQuery && filteredAdditional.length > 0 && (
                            <Paper variant="outlined" sx={{ mt: 1, borderRadius: tokens.semantic.radius.md.value }}>
                              <Stack divider={<Divider />}>
                                {filteredAdditional.map((s) => (
                                  <Stack key={s.id} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.25, cursor: "pointer", "&:hover": { backgroundColor: tokens.semantic.color.surface.variant.value } }} onClick={() => addStakeholder(s.id)}>
                                    <Stack spacing={0} flex={1}><Typography variant="textSm" fontWeight={500}>{s.name}</Typography><Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>{s.title} · {s.department}</Typography></Stack>
                                    <Button size="small" variant="outlined">Add</Button>
                                  </Stack>
                                ))}
                              </Stack>
                            </Paper>
                          )}
                          {searchQuery && filteredAdditional.length === 0 && (
                            <Typography variant="caption" sx={{ mt: 1, display: "block", color: tokens.semantic.color.type.muted.value }}>No additional stakeholders match "{searchQuery}"</Typography>
                          )}
                        </Box>
                      )}
                    </Paper>
                    {!notifyDone && (
                      <Button variant="contained" fullWidth sx={{ mt: 2 }} disabled={selected.size === 0} onClick={handleSendNotifications}>
                        Send notifications to {selected.size} stakeholder{selected.size !== 1 ? "s" : ""}
                      </Button>
                    )}
                  </Box>

                  {/* Sent confirmation */}
                  {notifyDone && (
                    <>
                      <Divider />
                      <ChatMessage timestamp={sentAt ?? ""} status="done" title="Stakeholders notified">
                        <Typography variant="textSm">
                          Notifications have been sent to <strong>{selectedStakeholders.length} stakeholders</strong>.
                          Each recipient received a context-aware notification explaining why they were notified.
                        </Typography>
                        <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, border: `1px solid ${tokens.semantic.color.status.success.default.value}`, backgroundColor: tokens.semantic.color.status.success.background.value }}>
                          <Stack spacing={0.5}>
                            {selectedStakeholders.map((s) => (
                              <Stack key={s.id} direction="row" alignItems="center" spacing={1}>
                                <CheckedCircleIcon style={{ fontSize: 16, color: tokens.semantic.color.status.success.text.value }} />
                                <Typography variant="textSm"><strong>{s.name}</strong> — {s.title}</Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                        {chatStep === "notify-sent" && (
                          <>
                            <Typography variant="textSm" sx={{ mt: 1.5 }}>
                              I recommend initiating remediation next. Would you like me to create ITSM tickets for the affected assets?
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                              <Button variant="contained" size="small" onClick={handleInitiateRemediation}>Initiate remediation</Button>
                              <Button variant="outlined" size="small" onClick={() => handleViewPhaseDetail("thirdParty")}>Third-party review</Button>
                              <Button variant="outlined" size="small" onClick={() => handleViewPhaseDetail("resolution")}>Resolution</Button>
                              <Button variant="outlined" size="small" onClick={() => handleViewPhaseDetail("boardBriefing")}>Board briefing</Button>
                            </Stack>
                          </>
                        )}
                      </ChatMessage>
                    </>
                  )}

                  {/* === Remediation messages === */}
                  {remediationStarted && (
                    <>
                      <Divider />
                      <ChatMessage timestamp={remediationStartedAt ?? ""} status="done" title="Linking failed controls and threats">
                        <Typography variant="textSm">
                          I've scanned your <strong>Asset Manager</strong> and <strong>Risk Manager</strong> to
                          link this incident back to the specific controls that failed and the related threats.
                        </Typography>
                        <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>Failed controls identified</Typography>
                          <Stack spacing={0.5}>
                            {failedControls.map((fc) => (<Typography key={fc.control} variant="textSm">· <strong>{fc.control}</strong> — {fc.policy}</Typography>))}
                          </Stack>
                        </Box>
                        <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>Related threats linked</Typography>
                          <Stack spacing={0.5}>
                            {relatedThreats.map((rt) => (<Typography key={rt.threat} variant="textSm">· <strong>{rt.threat}</strong> — {rt.category}</Typography>))}
                          </Stack>
                        </Box>
                      </ChatMessage>

                      <ChatMessage timestamp={remediationStartedAt ?? ""} status="done" title="ITSM tickets created">
                        <Typography variant="textSm">
                          I've created <strong>{remediationTickets.length} remediation tickets</strong> in
                          your ITSM system, grouped by environment and criticality.
                        </Typography>
                        <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>Patching sequence (optimized by criticality)</Typography>
                          <Stack spacing={0.75}>
                            {remediationTickets.map((t, i) => (
                              <Stack key={t.id} direction="row" alignItems="flex-start" spacing={1}>
                                <Box sx={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: tokens.semantic.color.action.primary.default.value, color: tokens.semantic.color.action.primary.onPrimary.value, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0, mt: 0.25 }}>{i + 1}</Box>
                                <Stack spacing={0}>
                                  <Typography variant="textSm"><strong>{t.id}</strong> — {t.system}</Typography>
                                  <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>{t.assets} · {t.priority} · Due {t.dueDate}</Typography>
                                </Stack>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                      </ChatMessage>

                      <ChatMessage timestamp={remediationStartedAt ?? ""} status="done" title="Compensating controls activated">
                        <Typography variant="textSm">While patching is underway, I've activated interim compensating controls:</Typography>
                        <Box sx={{ mt: 1.5, p: 2, borderRadius: tokens.semantic.radius.md.value, border: `1px solid ${tokens.semantic.color.status.warning.default.value}`, backgroundColor: tokens.semantic.color.status.warning.background.value }}>
                          <Stack spacing={0.5}>
                            <Typography variant="textSm">· Network segmentation applied to isolate affected production servers</Typography>
                            <Typography variant="textSm">· Enhanced monitoring rules activated for lateral movement indicators</Typography>
                            <Typography variant="textSm">· Temporary WAF rules deployed to block known exploit payloads</Typography>
                            <Typography variant="textSm">· CrowdStrike prevention policy escalated to maximum enforcement</Typography>
                          </Stack>
                        </Box>
                        <Typography variant="textSm" sx={{ mt: 1.5 }}>
                          Remediation is now in progress. I'll monitor ticket progress and send nudges if any stalls.
                          You can track the overall workflow status on the right.
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                          <Button variant="outlined" size="small" onClick={() => handleViewPhaseDetail("thirdParty")}>Third-party review</Button>
                          <Button variant="outlined" size="small" onClick={() => handleViewPhaseDetail("resolution")}>Resolution</Button>
                          <Button variant="outlined" size="small" onClick={() => handleViewPhaseDetail("boardBriefing")}>Board briefing</Button>
                        </Stack>
                      </ChatMessage>
                    </>
                  )}
                </>
              )}

              <div ref={chatEndRef} />
            </Stack>
          </Box>

          {/* Chat input */}
          <Box sx={{ p: 2, borderTop: `1px solid ${tokens.semantic.color.outline.fixed.value}`, backgroundColor: tokens.semantic.color.surface.default.value }}>
            <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", px: 1.5, py: 0.5, borderRadius: tokens.semantic.radius.lg.value }}>
              <IconButton size="small" sx={{ color: tokens.semantic.color.type.muted.value }}><AttachIcon /></IconButton>
              <TextField placeholder="Ask about this incident or request an action..." variant="standard" fullWidth slotProps={{ input: { disableUnderline: true } }} sx={{ mx: 1 }} />
              <IconButton size="small" sx={{ color: tokens.semantic.color.type.muted.value }}><SendIcon /></IconButton>
            </Paper>
            <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1, color: tokens.semantic.color.type.muted.value }}>
              AI-generated content may have inaccuracies.{" "}
              <Typography component="span" variant="caption" sx={{ textDecoration: "underline", cursor: "pointer", color: tokens.semantic.color.type.muted.value }}>Learn more.</Typography>
            </Typography>
          </Box>
        </Box>

        {/* Right panel */}
        <Box sx={{ width: "50%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {rightPanelContent}
        </Box>
      </Box>
    </Box>
  );
}

// ─── StakeholderRow sub-component ────────────────────────────────────────────

function StakeholderRow({ stakeholder, checked, onChange, disabled }: { stakeholder: Stakeholder; checked: boolean; onChange: () => void; disabled?: boolean }) {
  const { tokens } = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1.5, py: 1.25, "&:hover": disabled ? {} : { backgroundColor: tokens.semantic.color.surface.subtle.value } }}>
      <Checkbox size="small" checked={checked} onChange={onChange} disabled={disabled} sx={{ p: 0.5 }} />
      <Stack spacing={0} flex={1} sx={{ minWidth: 0 }}>
        <Typography variant="textSm" fontWeight={600}>{stakeholder.name}</Typography>
        <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>{stakeholder.title} · {stakeholder.department}</Typography>
        <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, fontStyle: "italic", mt: 0.25 }}>{stakeholder.reason}</Typography>
      </Stack>
    </Stack>
  );
}
