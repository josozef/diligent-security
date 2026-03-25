import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";

import TriageReportPanel from "../components/investigation/TriageReportPanel.js";
import InvestigationChatPanel from "../components/investigation/InvestigationChatPanel.js";
import NotificationPanel from "../components/investigation/NotificationPanel.js";
import RemediationPanel from "../components/investigation/RemediationPanel.js";
import ThirdPartyPanel from "../components/investigation/ThirdPartyPanel.js";
import ResolutionPanel from "../components/investigation/ResolutionPanel.js";
import BoardBriefingPanel from "../components/investigation/BoardBriefingPanel.js";

// ─── Persistence ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "incident-investigation-state";
const STEP_COUNT = 6;

interface PersistedState {
  currentStep: number;
  completedSteps: number[];
}

function loadState(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignore
  }
  return { currentStep: 1, completedSteps: [] };
}

function saveState(state: PersistedState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function IncidentInvestigationPage() {
  const { tokens } = useTheme();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(() => loadState().currentStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => loadState().completedSteps);

  useEffect(() => {
    saveState({ currentStep, completedSteps });
  }, [currentStep, completedSteps]);

  const advanceStep = useCallback((fromStep: number) => {
    setCompletedSteps((prev) => (prev.includes(fromStep) ? prev : [...prev, fromStep]));
    if (fromStep < STEP_COUNT) setCurrentStep(fromStep + 1);
  }, []);

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setCompletedSteps([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // ─── Sidebar nav data ──────────────────────────────────────────────────────

  const done = (n: number) => completedSteps.includes(n);
  const statusOf = (n: number): "complete" | "in-progress" | "not-started" =>
    done(n) ? "complete" : currentStep === n ? "in-progress" : "not-started";

  const navSteps: NavStep[] = [
    {
      key: "triage",
      label: "Automated triage",
      status: done(1) ? "complete" : currentStep >= 1 ? "in-progress" : "not-started",
      timestamp: done(1) ? "2:14 PM" : undefined,
      artifacts: currentStep >= 1
        ? [{ label: "Triage report" }, { label: "Threat analysis", detail: "3 identified" }]
        : [],
    },
    {
      key: "notify",
      label: "Notify stakeholders",
      status: statusOf(2),
      artifacts: done(2)
        ? [{ label: "Notifications sent", detail: "5 recipients" }]
        : currentStep === 2
          ? [{ label: "Draft notifications", detail: "5 selected" }]
          : [],
    },
    {
      key: "remediation",
      label: "Remediation",
      status: statusOf(3),
      artifacts: done(3) || currentStep === 3
        ? [{ label: "ITSM tickets", detail: "5 created" }, { label: "Control gaps", detail: "4 mapped" }]
        : [],
    },
    {
      key: "thirdParty",
      label: "Third-party review",
      status: statusOf(4),
      artifacts: done(4) ? [{ label: "Vendor assessment" }] : [],
    },
    {
      key: "resolution",
      label: "Resolution",
      status: statusOf(5),
      artifacts: done(5) ? [{ label: "Evidence pack" }, { label: "Closure summary" }] : [],
    },
    {
      key: "boardBriefing",
      label: "Board briefing",
      status: statusOf(6),
      artifacts: done(6) ? [{ label: "Board memo" }] : [],
    },
  ];

  const completedCount = navSteps.filter((s) => s.status === "complete").length;

  // ─── Center panel ─────────────────────────────────────────────────────────

  function renderPanel() {
    switch (currentStep) {
      case 1:
        return <TriageReportPanel completed={done(1)} onProceed={() => advanceStep(1)} />;
      case 2:
        return <NotificationPanel onProceed={() => advanceStep(2)} />;
      case 3:
        return <RemediationPanel onProceed={() => advanceStep(3)} />;
      case 4:
        return <ThirdPartyPanel onProceed={() => advanceStep(4)} />;
      case 5:
        return <ResolutionPanel onProceed={() => advanceStep(5)} />;
      case 6:
        return <BoardBriefingPanel onComplete={() => advanceStep(6)} />;
      default:
        return null;
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", minHeight: 0 }}>
      {/* Top bar */}
      <Box
        sx={{
          backgroundColor: tokens.semantic.color.surface.default.value,
          borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          px: 3,
          py: 1.25,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton size="small" onClick={() => navigate("/")}>
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={600}>CVE-2026-1847</Typography>
            <Chip label="Critical" size="small" color="error" />
          </Stack>
          <Button
            variant="text"
            size="small"
            onClick={handleReset}
            sx={{ color: tokens.semantic.color.type.muted.value, textTransform: "none", fontSize: 12 }}
          >
            Reset demo
          </Button>
        </Stack>
      </Box>

      {/* Three-column layout */}
      <Box sx={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Left: Workflow nav sidebar */}
        <Box
          sx={{
            width: 260,
            flexShrink: 0,
            borderRight: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            backgroundColor: tokens.semantic.color.surface.default.value,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.75 }}>
              Incident workflow
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(completedCount / STEP_COUNT) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: tokens.semantic.color.outline.fixed.value,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 2,
                      backgroundColor: tokens.semantic.color.status.success.default.value,
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, flexShrink: 0 }}>
                {completedCount}/{STEP_COUNT}
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: tokens.semantic.color.outline.fixed.value }} />

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {navSteps.map((step, i) => (
              <WorkflowNavItem
                key={step.key}
                label={step.label}
                status={step.status}
                timestamp={step.timestamp}
                artifacts={step.artifacts}
                active={currentStep === i + 1}
                onClick={() => handleStepClick(i + 1)}
              />
            ))}
          </Box>
        </Box>

        {/* Center: Step content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "auto", p: 3 }}>
          <Box sx={{ mx: "auto", maxWidth: 720, width: "100%" }}>
            {renderPanel()}
          </Box>
        </Box>

        {/* Right: AI Security Assistant (Atlas AI chat + same transcript as linear prototype) */}
        <InvestigationChatPanel />
      </Box>
    </Box>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface NavStep {
  key: string;
  label: string;
  status: "complete" | "in-progress" | "not-started";
  timestamp?: string;
  artifacts: Array<{ label: string; detail?: string }>;
}

function WorkflowNavItem({
  label,
  status,
  timestamp,
  artifacts,
  active,
  onClick,
}: {
  label: string;
  status: NavStep["status"];
  timestamp?: string;
  artifacts: NavStep["artifacts"];
  active: boolean;
  onClick: () => void;
}) {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const success = tokens.semantic.color.status.success.default.value;
  const warning = tokens.semantic.color.status.warning.default.value;
  const outline = tokens.semantic.color.outline.default.value;
  const primary = tokens.semantic.color.action.primary.default.value;

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: active ? tokens.semantic.color.surface.variant.value : "transparent",
        border: "none",
        borderLeft: `3px solid ${active ? primary : "transparent"}`,
        cursor: "pointer",
        px: 2,
        py: 1.5,
        font: "inherit",
        color: "inherit",
        transition: (t) => t.transitions.create(["background-color", "border-color"], { duration: t.transitions.duration.shorter }),
        "&:hover": {
          backgroundColor: active
            ? tokens.semantic.color.surface.variant.value
            : tokens.semantic.color.surface.subtle.value,
        },
        "&:focus-visible": {
          outline: `2px solid ${primary}`,
          outlineOffset: -2,
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box sx={{ pt: 0.25, flexShrink: 0 }}>
          {status === "complete" ? (
            <CheckedCircleIcon style={{ fontSize: 18, color: success }} />
          ) : (
            <Box sx={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  ...(status === "in-progress"
                    ? { backgroundColor: warning, boxShadow: `0 0 0 3px ${warning}40` }
                    : { border: `1.5px solid ${outline}`, backgroundColor: "transparent" }),
                }}
              />
            </Box>
          )}
        </Box>

        <Stack spacing={0.25} flex={1} minWidth={0}>
          <Typography
            variant="textSm"
            fontWeight={active ? 600 : 500}
            sx={{ lineHeight: 1.3, color: tokens.semantic.color.type.default.value }}
          >
            {label}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: "0.675rem",
              color: status === "complete" ? success : status === "in-progress" ? warning : muted,
            }}
          >
            {status === "complete" && timestamp
              ? `Completed ${timestamp}`
              : status === "in-progress"
                ? "In progress"
                : "Not started"}
          </Typography>

          {artifacts.length > 0 && (
            <Stack spacing={0.25} sx={{ mt: 0.5 }}>
              {artifacts.map((a) => (
                <Stack key={a.label} direction="row" spacing={0.75} alignItems="center">
                  <DocumentIcon style={{ fontSize: 12, color: muted, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ color: muted, fontSize: "0.65rem", lineHeight: 1.3 }}>
                    {a.label}
                    {a.detail && (
                      <Box component="span" sx={{ ml: 0.5, opacity: 0.7 }}>
                        · {a.detail}
                      </Box>
                    )}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

