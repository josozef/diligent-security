import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AIChatBox,
  AIChatContextProvider,
  StatusIndicator,
} from "@diligentcorp/atlas-react-bundle";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import VirusFoundIcon from "@diligentcorp/atlas-react-bundle/icons/VirusFound";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";

import TriageReportPanel from "../components/investigation/TriageReportPanel.js";
import { type Stakeholder } from "../components/investigation/NotificationPreviewPanel.js";
import RemediationPlanPanel, {
  type RemediationTicket,
} from "../components/investigation/RemediationPlanPanel.js";
import { type PhaseStatus } from "../components/investigation/WorkflowStatusPanel.js";
import StepPreviewPanel from "../components/investigation/StepPreviewPanel.js";
import BoardBriefingPanel from "../components/investigation/BoardBriefingPanel.js";

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

type LeftView =
  | "hub"
  | "triage-report"
  | "notification"
  | "remediation-plan"
  | "third-party-review"
  | "resolution"
  | "board-briefing";

interface WorkflowStep {
  key: string;
  label: string;
  status: PhaseStatus;
  summary: string;
  completedAt?: string;
  ctaLabel: string;
  onCta: () => void;
}

const WORKFLOW_STORAGE_KEY_PREFIX = "incident-workflow-";

interface PersistedWorkflowState {
  phases: Record<string, PhaseStatus>;
  phaseTimestamps: Record<string, string>;
  leftView: LeftView;
  selectedIds: string[];
  sentAt: string | null;
  remediationStartedAt: string | null;
}

function getStorageKey(incidentId: string): string {
  return `${WORKFLOW_STORAGE_KEY_PREFIX}${incidentId}`;
}

function loadWorkflowState(incidentId: string): PersistedWorkflowState | null {
  try {
    const raw = sessionStorage.getItem(getStorageKey(incidentId));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedWorkflowState;
  } catch {
    return null;
  }
}

function saveWorkflowState(incidentId: string, state: PersistedWorkflowState): void {
  try {
    sessionStorage.setItem(getStorageKey(incidentId), JSON.stringify(state));
  } catch {
    // ignore
  }
}

function clearWorkflowState(incidentId: string): void {
  try {
    sessionStorage.removeItem(getStorageKey(incidentId));
  } catch {
    // ignore
  }
}

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

const defaultPhases: Record<string, PhaseStatus> = {
  notify: "not-started",
  remediation: "not-started",
  thirdParty: "not-started",
  resolution: "not-started",
  boardBriefing: "not-started",
};

export default function IncidentInvestigationPage() {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const { incidentId = "" } = useParams<{ incidentId: string }>();
  const hasHydratedRef = useRef(false);

  const [leftView, setLeftView] = useState<LeftView>("hub");

  // Phase completion state
  const [phases, setPhases] = useState<Record<string, PhaseStatus>>(defaultPhases);
  const [phaseTimestamps, setPhaseTimestamps] = useState<Record<string, string>>({});

  // Notify step state
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(recommendedStakeholders.map((s) => s.id)),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sentAt, setSentAt] = useState<string | null>(null);

  // Remediation step state
  const [remediationStartedAt, setRemediationStartedAt] = useState<string | null>(null);

  // Restore saved state on mount
  useEffect(() => {
    if (!incidentId) {
      hasHydratedRef.current = true;
      return;
    }
    const saved = loadWorkflowState(incidentId);
    if (saved) {
      setPhases(saved.phases ?? defaultPhases);
      setPhaseTimestamps(saved.phaseTimestamps ?? {});
      setLeftView(saved.leftView ?? "hub");
      setSelected(new Set(saved.selectedIds ?? recommendedStakeholders.map((s) => s.id)));
      setSentAt(saved.sentAt ?? null);
      setRemediationStartedAt(saved.remediationStartedAt ?? null);
    }
    hasHydratedRef.current = true;
  }, [incidentId]);

  // Persist workflow state when it changes
  useEffect(() => {
    if (!incidentId || !hasHydratedRef.current) return;
    saveWorkflowState(incidentId, {
      phases,
      phaseTimestamps,
      leftView,
      selectedIds: Array.from(selected),
      sentAt,
      remediationStartedAt,
    });
  }, [incidentId, phases, phaseTimestamps, leftView, selected, sentAt, remediationStartedAt]);

  const allStakeholders = [...recommendedStakeholders, ...additionalStakeholders];
  const selectedStakeholders = allStakeholders.filter((s) => selected.has(s.id));
  const filteredAdditional = additionalStakeholders.filter(
    (s) =>
      !selected.has(s.id) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase())),
  );

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

  function handleGoToNotify() {
    setPhases((p) => ({ ...p, notify: p.notify === "not-started" ? "in-progress" : p.notify }));
    setLeftView("notification");
  }

  function handleSendNotifications() {
    const ts = formatTimestamp();
    setSentAt(ts);
    setPhases((p) => ({ ...p, notify: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, notify: ts }));
    setLeftView("hub");
  }

  function handleGoToRemediation() {
    setLeftView("remediation-plan");
  }

  function handleInitiateRemediation() {
    const ts = formatTimestamp();
    setRemediationStartedAt(ts);
    setPhases((p) => ({ ...p, remediation: "in-progress" }));
    setPhaseTimestamps((t) => ({ ...t, remediation: ts }));
    setLeftView("hub");
  }

  function handleStartThirdPartyReview() {
    const ts = formatTimestamp();
    setPhases((p) => ({ ...p, thirdParty: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, thirdParty: ts }));
    setLeftView("hub");
  }

  function handleCompleteResolution() {
    const ts = formatTimestamp();
    setPhases((p) => ({ ...p, resolution: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, resolution: ts }));
    setLeftView("hub");
  }

  function handleSendBoardBriefing() {
    const ts = formatTimestamp();
    setPhases((p) => ({ ...p, boardBriefing: "complete" }));
    setPhaseTimestamps((t) => ({ ...t, boardBriefing: ts }));
    setLeftView("hub");
  }

  function handleBackToHub() {
    setLeftView("hub");
  }

  function handleResetDemo() {
    if (incidentId) clearWorkflowState(incidentId);
    window.location.reload();
  }

  // ─── Workflow steps for hub ────────────────────────────────────────────────

  const workflowSteps: WorkflowStep[] = [
    {
      key: "triage",
      label: "Automated triage",
      status: "complete",
      summary: "Cross-referenced 12 assets against policies, compliance frameworks, risk register, and known threats.",
      completedAt: "Today, 2:15 PM",
      ctaLabel: "View report",
      onCta: () => setLeftView("triage-report"),
    },
    {
      key: "notify",
      label: "Notify stakeholders",
      status: phases.notify,
      completedAt: phaseTimestamps.notify ? `Today, ${phaseTimestamps.notify}` : undefined,
      summary:
        phases.notify === "complete"
          ? `Context-aware notifications sent to ${selectedStakeholders.length} stakeholders.`
          : "Route context-aware alerts to asset owners, CISO, and General Counsel.",
      ctaLabel: phases.notify === "not-started" ? "Notify stakeholders" : "View details",
      onCta: handleGoToNotify,
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
      ctaLabel: phases.remediation === "not-started" ? "Initiate remediation" : "View details",
      onCta: handleGoToRemediation,
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
      ctaLabel: phases.thirdParty === "complete" ? "View details" : "Start review",
      onCta: () => setLeftView("third-party-review"),
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
      ctaLabel: phases.resolution === "complete" ? "View details" : "Mark complete",
      onCta: () => setLeftView("resolution"),
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
      ctaLabel: phases.boardBriefing === "complete" ? "View details" : "Send briefing",
      onCta: () => setLeftView("board-briefing"),
    },
  ];

  const allPhases = { triage: "complete" as PhaseStatus, ...phases };
  const incident = overallStatus(allPhases);
  const completedCount = Object.values(allPhases).filter((v) => v === "complete").length;
  const totalCount = Object.keys(allPhases).length;

  const statusChip =
    incident === "complete" ? (
      <StatusIndicator icon={<CheckedCircleIcon />} label="Complete" size="small" color="success" />
    ) : incident === "in-progress" ? (
      <StatusIndicator label="In progress" size="small" color="warning" />
    ) : (
      <StatusIndicator label="Not started" size="small" color="subtle" />
    );

  // ─── Left panel content ───────────────────────────────────────────────────

  let leftPanelContent: ReactNode;

  if (leftView === "hub") {
    leftPanelContent = (
      <Box sx={{ flex: 1, overflow: "auto", p: 3, backgroundColor: tokens.semantic.color.surface.subtle.value }}>
        <Stack spacing={2}>
          {/* Incident summary */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: tokens.semantic.color.status.error.background.value,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <VirusFoundIcon style={{ fontSize: 20, color: tokens.semantic.color.status.error.text.value }} />
                </Box>
                <Stack spacing={0.25} flex={1}>
                  <Typography variant="subtitle1" fontWeight={600}>CVE-2026-1847</Typography>
                  <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>
                    CrowdStrike Falcon Sensor for Windows · Remote code execution (heap overflow)
                  </Typography>
                </Stack>
                <Chip label="CVSS 9.8" size="small" color="error" />
              </Stack>

              <Divider />

              <Stack direction="row" spacing={4} flexWrap="wrap">
                <SummaryMetric label="Affected assets" value="12 across 3 systems" />
                <SummaryMetric label="Exploit status" value="Active exploitation" />
                <SummaryMetric label="Risk level" value="Critical — Likely material" />
                <SummaryMetric label="Detected" value="Today, 2:14 PM" />
              </Stack>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: tokens.semantic.radius.sm.value,
                  border: `1px solid ${tokens.semantic.color.status.error.default.value}`,
                  backgroundColor: tokens.semantic.color.status.error.background.value,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" fontWeight={600}>Materiality assessment</Typography>
                  <StatusIndicator label="Requires review" size="small" color="error" />
                </Stack>
                <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>
                  Active exploit targeting production payment processing infrastructure in PCI scope.
                  Recommend escalation to CISO and General Counsel for SEC 8-K / 10-K evaluation.
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Workflow progress */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="textSm" fontWeight={600}>Suggested response workflow</Typography>
                <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>
                  {completedCount} of {totalCount} steps complete
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(completedCount / totalCount) * 100}
                color={completedCount === totalCount ? "success" : "warning"}
                sx={{ borderRadius: 1, height: 5 }}
              />
            </Stack>
          </Paper>

          {/* Workflow step cards */}
          {workflowSteps.map((step) => (
            <Paper
              key={step.key}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: tokens.semantic.radius.md.value,
                backgroundColor: tokens.semantic.color.surface.default.value,
                border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="textSm" fontWeight={600}>{step.label}</Typography>
                  <StatusChip status={step.status} />
                </Stack>
                <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>
                  {step.summary}
                </Typography>
                {step.completedAt && (
                  <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, fontSize: "0.675rem" }}>
                    Completed {step.completedAt}
                  </Typography>
                )}
                <Button
                  variant={step.status === "not-started" ? "contained" : "outlined"}
                  size="small"
                  onClick={step.onCta}
                  sx={{ alignSelf: "flex-start", mt: 0.5 }}
                >
                  {step.ctaLabel}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  } else if (leftView === "triage-report") {
    leftPanelContent = (
      <TriageReportPanel
        onBack={handleBackToHub}
        onNotifyStakeholders={phases.notify === "not-started" ? handleGoToNotify : undefined}
      />
    );
  } else if (leftView === "notification") {
    const notifyDone = phases.notify === "complete";
    leftPanelContent = (
      <Stack spacing={0} sx={{ height: "100%" }}>
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            backgroundColor: tokens.semantic.color.surface.default.value,
            flexShrink: 0,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton size="small" onClick={handleBackToHub}><ArrowLeftIcon /></IconButton>
              <Typography variant="subtitle1" fontWeight={600}>Notify stakeholders</Typography>
            </Stack>
            {notifyDone && (
              <StatusIndicator icon={<CheckedCircleIcon />} label={`Sent ${sentAt}`} size="small" color="success" />
            )}
          </Stack>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", p: 2, backgroundColor: tokens.semantic.color.surface.subtle.value }}>
          <Stack spacing={1.5}>
            {/* Stakeholder selection */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: tokens.semantic.radius.md.value,
                backgroundColor: tokens.semantic.color.surface.default.value,
                border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
                overflow: "hidden",
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}` }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="textSm" fontWeight={600}>Select stakeholders</Typography>
                  <Chip label={`${selected.size} selected`} size="small" variant="outlined" />
                </Stack>
              </Box>
              <Stack divider={<Divider />}>
                {recommendedStakeholders.map((s) => (
                  <StakeholderRow key={s.id} stakeholder={s} checked={selected.has(s.id)} onChange={() => toggleStakeholder(s.id)} disabled={notifyDone} />
                ))}
              </Stack>
              {!notifyDone && (
                <Box sx={{ px: 2, py: 1.5, borderTop: `1px solid ${tokens.semantic.color.outline.fixed.value}`, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                  <TextField
                    size="small"
                    placeholder="Search to add stakeholder..."
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{ input: { startAdornment: <SearchIcon style={{ fontSize: 18, marginRight: 8, color: tokens.semantic.color.type.muted.value }} /> } }}
                  />
                  {searchQuery && filteredAdditional.length > 0 && (
                    <Paper variant="outlined" sx={{ mt: 1, borderRadius: tokens.semantic.radius.md.value }}>
                      <Stack divider={<Divider />}>
                        {filteredAdditional.map((s) => (
                          <Stack key={s.id} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.25, cursor: "pointer", "&:hover": { backgroundColor: tokens.semantic.color.surface.variant.value } }} onClick={() => addStakeholder(s.id)}>
                            <Stack spacing={0} flex={1}>
                              <Typography variant="textSm" fontWeight={500}>{s.name}</Typography>
                              <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>{s.title} · {s.department}</Typography>
                            </Stack>
                            <Button size="small" variant="outlined">Add</Button>
                          </Stack>
                        ))}
                      </Stack>
                    </Paper>
                  )}
                  {searchQuery && filteredAdditional.length === 0 && (
                    <Typography variant="caption" sx={{ mt: 1, display: "block", color: tokens.semantic.color.type.muted.value }}>
                      No additional stakeholders match &quot;{searchQuery}&quot;
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>

            {!notifyDone && (
              <Button
                variant="contained"
                fullWidth
                size="medium"
                disabled={selected.size === 0}
                onClick={handleSendNotifications}
              >
                Send notifications to {selected.size} stakeholder{selected.size !== 1 ? "s" : ""}
              </Button>
            )}

            {/* Message preview */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: tokens.semantic.radius.md.value,
                backgroundColor: tokens.semantic.color.surface.default.value,
                border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  backgroundColor: tokens.semantic.color.status.error.background.value,
                  borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: tokens.semantic.color.status.error.default.value,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: tokens.semantic.color.status.error.text.value,
                      flexShrink: 0,
                    }}
                  >
                    <VirusFoundIcon style={{ fontSize: 18 }} />
                  </Box>
                  <Stack spacing={0.25} flex={1}>
                    <Typography variant="textSm" fontWeight={600}>
                      Critical security incident requires your attention
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label="Critical" size="small" color="error" />
                      <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>
                        CVE-2026-1847 · CVSS 9.8
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ px: 2, py: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="caption">
                    You're receiving this because you own or are responsible for assets affected by a critical
                    security vulnerability that requires immediate action.
                  </Typography>
                  <Box sx={{ p: 1.5, borderRadius: tokens.semantic.radius.sm.value, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                    <Typography variant="caption" fontWeight={600} sx={{ display: "block", mb: 0.75 }}>Incident summary</Typography>
                    <Stack spacing={0.25}>
                      <DetailRow label="Vulnerability" value="CVE-2026-1847 (CVSS 9.8)" />
                      <DetailRow label="Vendor" value="CrowdStrike Falcon Sensor for Windows" />
                      <DetailRow label="Type" value="Remote code execution (heap overflow)" />
                      <DetailRow label="Exploit status" value="Active exploitation confirmed" />
                      <DetailRow label="Affected assets" value="12 assets across 3 business-critical systems" />
                      <DetailRow label="Detected" value="Today, 2:14 PM EST" />
                    </Stack>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: tokens.semantic.radius.sm.value, backgroundColor: tokens.semantic.color.surface.variant.value }}>
                    <Typography variant="caption" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>Compliance frameworks at risk</Typography>
                    <Stack spacing={0}>
                      <Typography variant="caption">· SOC 2 Type II — CC6.1, CC7.2</Typography>
                      <Typography variant="caption">· ISO 27001:2022 — A.12.6.1</Typography>
                      <Typography variant="caption">· NIST CSF 2.0 — ID.RA-1</Typography>
                      <Typography variant="caption">· PCI DSS v4.0 — Req 6.3.3</Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: tokens.semantic.radius.sm.value,
                      border: `1px solid ${tokens.semantic.color.status.error.default.value}`,
                      backgroundColor: tokens.semantic.color.status.error.background.value,
                    }}
                  >
                    <Typography variant="caption" fontWeight={600} sx={{ display: "block", mb: 0.25 }}>Required action</Typography>
                    <Typography variant="caption">
                      Review the affected assets you own, confirm business impact, and coordinate with the
                      security team on the remediation timeline.
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, fontSize: "0.65rem" }}>
                    This notification was generated by the Diligent Security Incident Governance workflow.
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Stack>
        </Box>
      </Stack>
    );
  } else if (leftView === "remediation-plan") {
    leftPanelContent = (
      <RemediationPlanPanel
        tickets={remediationTickets}
        failedControls={failedControls}
        relatedThreats={relatedThreats}
        onBack={handleBackToHub}
        onInitiateRemediation={handleInitiateRemediation}
        remediationStarted={phases.remediation !== "not-started"}
      />
    );
  } else if (leftView === "third-party-review") {
    leftPanelContent = (
      <StepPreviewPanel
        title="Third-party review"
        description="Assess CrowdStrike vendor record, SLAs, and compensating controls. This step will document the vendor assessment and any follow-up actions."
        summary="Review vendor security posture and contract terms related to this incident."
        ctaLabel="Start third-party review"
        onCtaClick={handleStartThirdPartyReview}
        completed={phases.thirdParty === "complete"}
        completedAt={phaseTimestamps.thirdParty ? `Today, ${phaseTimestamps.thirdParty}` : undefined}
        onBack={handleBackToHub}
      />
    );
  } else if (leftView === "resolution") {
    leftPanelContent = (
      <StepPreviewPanel
        title="Resolution"
        description="Verify patches deployed, close ITSM tickets, and compile the evidence pack for audit. Confirm all remediation tickets are resolved and controls are restored."
        summary="Formally close the incident once remediation is verified."
        ctaLabel="Mark resolution complete"
        onCtaClick={handleCompleteResolution}
        completed={phases.resolution === "complete"}
        completedAt={phaseTimestamps.resolution ? `Today, ${phaseTimestamps.resolution}` : undefined}
        onBack={handleBackToHub}
      />
    );
  } else if (leftView === "board-briefing") {
    leftPanelContent = (
      <BoardBriefingPanel
        onBack={handleBackToHub}
        onSend={handleSendBoardBriefing}
        completed={phases.boardBriefing === "complete"}
        completedAt={phaseTimestamps.boardBriefing ? `Today, ${phaseTimestamps.boardBriefing}` : undefined}
      />
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

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
          {statusChip}
        </Stack>
      </Box>

      {/* Two-panel content */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left: Workflow panel (3/4) */}
        <Box
          sx={{
            width: "75%",
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          }}
        >
          {leftPanelContent}
        </Box>

        {/* Right: Chat assistant (1/4) */}
        <Box
          sx={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: tokens.semantic.color.surface.default.value,
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              flexShrink: 0,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <AiSparkleIcon style={{ fontSize: 18, color: tokens.semantic.color.type.muted.value }} />
              <Typography variant="textSm" fontWeight={600}>Assistant</Typography>
            </Stack>
          </Box>

          {/* Chat messages area (empty state) */}
          <Box sx={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
            <Stack alignItems="center" spacing={1.5} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: tokens.semantic.color.surface.variant.value,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AiSparkleIcon style={{ fontSize: 24, color: tokens.semantic.color.type.muted.value }} />
              </Box>
              <Typography variant="textSm" fontWeight={600}>How can I help?</Typography>
              <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>
                Ask about this incident, request analysis, or get recommendations.
              </Typography>
            </Stack>
          </Box>

          {/* Chat input (pinned to bottom) — Atlas AI Chatbox; compact layout matches narrow rail / mobile */}
          <Box
            sx={{
              px: 1,
              py: 1,
              borderTop: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              flexShrink: 0,
            }}
          >
            <InvestigationAssistantChatBox />
          </Box>
        </Box>
      </Box>

      {/* Demo reset */}
      <Box sx={{ px: 2, py: 0.75, textAlign: "right", borderTop: `1px solid ${tokens.semantic.color.outline.fixed.value}`, flexShrink: 0 }}>
        <Button variant="text" size="small" onClick={handleResetDemo} sx={{ color: tokens.semantic.color.type.muted.value, textTransform: "none", fontSize: 12 }}>
          Reset demo
        </Button>
      </Box>
    </Box>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Atlas AI Chatbox for the investigation assistant rail (narrow width ≈ mobile-style density). */
function InvestigationAssistantChatBox() {
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AIChatContextProvider>
      <AIChatBox
        isUploadAvailable
        onSubmit={() => {
          // Prototype: keep the prompt and avoid stuck "generating" state without a backend.
          return false;
        }}
        slotProps={{
          root: {
            sx: {
              width: "100%",
              maxWidth: "100%",
              alignSelf: "stretch",
            },
          },
          textField: {
            placeholder: "Ask a question...",
            label: "Ask the assistant",
            slotProps: {
              textField: {
                minRows: isMobileViewport ? 1 : 2,
                maxRows: isMobileViewport ? 4 : 6,
              },
            },
          },
          disclaimer: {
            stackProps: {
              sx: { display: "none" },
            },
          },
          submitButton: {
            submitButtonAriaLabel: "Send message",
            stopButtonAriaLabel: "Stop generating",
          },
          uploadButton: {
            ariaLabel: "Attach file",
          },
        }}
      />
    </AIChatContextProvider>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  const { tokens } = useTheme();
  return (
    <Stack spacing={0}>
      <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, fontSize: "0.675rem" }}>
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={600}>{value}</Typography>
    </Stack>
  );
}

function StatusChip({ status }: { status: PhaseStatus }) {
  if (status === "complete")
    return <StatusIndicator icon={<CheckedCircleIcon />} label="Complete" size="small" color="success" />;
  if (status === "in-progress")
    return <StatusIndicator label="In progress" size="small" color="warning" />;
  return <StatusIndicator label="Not started" size="small" color="subtle" />;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { tokens } = useTheme();
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, minWidth: 100, flexShrink: 0, fontSize: "0.675rem" }}>
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={500} sx={{ fontSize: "0.675rem" }}>{value}</Typography>
    </Stack>
  );
}

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
