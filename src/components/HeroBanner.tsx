import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import VirusFoundIcon from "@diligentcorp/atlas-react-bundle/icons/VirusFound";
import ThirdPartyIcon from "@diligentcorp/atlas-react-bundle/icons/ThirdParty";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";

interface Notification {
  id: string;
  severity: "critical" | "high" | "medium";
  icon: ReactNode;
  title: string;
  description: string;
  metadata: string;
  actionLabel: string;
  route?: string;
}

const notifications: Notification[] = [
  {
    id: "vuln-cve-2026-1847",
    severity: "critical",
    icon: <VirusFoundIcon />,
    title: "Critical vulnerability detected",
    description:
      "CVE-2026-1847 (CVSS 9.8) has been detected across 12 IT assets in 3 business-critical systems. Your security monitoring agents flagged active exploit activity. Immediate review is recommended.",
    metadata: "CVSS 9.8 · 12 assets · Active exploit · Detected 23 min ago",
    actionLabel: "Investigate",
    route: "/investigate/cve-2026-1847",
  },
  {
    id: "vendor-soc2-expired",
    severity: "high",
    icon: <ThirdPartyIcon />,
    title: "Vendor compliance gap requires action",
    description:
      "Acme Cloud Services' SOC 2 Type II certification expired 3 days ago. 8 business processes and 14 IT assets depend on this vendor's infrastructure. Renewal verification is required.",
    metadata: "SOC 2 expired · 8 processes affected · Vendor tier 1",
    actionLabel: "Review vendor",
  },
];

const monitoringAgents = [
  { name: "Vulnerability scanner", lastRun: "Last 8 min ago", nextRun: "next in 22 min" },
  { name: "Threat intelligence", lastRun: "Last 15 min ago", nextRun: "next in 45 min" },
  { name: "Compliance monitor", lastRun: "Last 32 min ago", nextRun: "next in 28 min" },
];

const severityConfig = {
  critical: {
    borderColor: "#d32f2f",
    bg: "rgba(211,47,47,0.04)",
    iconBg: "rgba(211,47,47,0.08)",
    chipColor: "error" as const,
    chipLabel: "Critical",
    buttonVariant: "contained" as const,
    buttonColor: "destructive" as const,
  },
  high: {
    borderColor: "#ed6c02",
    bg: "rgba(237,108,2,0.04)",
    iconBg: "rgba(237,108,2,0.08)",
    chipColor: "warning" as const,
    chipLabel: "High",
    buttonVariant: "outlined" as const,
    buttonColor: "primary" as const,
  },
  medium: {
    borderColor: "#0288d1",
    bg: "rgba(2,136,209,0.04)",
    iconBg: "rgba(2,136,209,0.08)",
    chipColor: "info" as const,
    chipLabel: "Medium",
    buttonVariant: "outlined" as const,
    buttonColor: "primary" as const,
  },
};

interface HeroBannerProps {
  hasAlerts?: boolean;
}

export default function HeroBanner({ hasAlerts = true }: HeroBannerProps) {
  const { tokens } = useTheme();
  const navigate = useNavigate();

  return (
    <Stack spacing={2.5}>
      {hasAlerts ? <AlertsBanner tokens={tokens} navigate={navigate} /> : <ClearBanner tokens={tokens} />}

      {/* Monitoring agents status bar */}
      <Stack
        direction="row"
        spacing={2.5}
        alignItems="center"
        flexWrap="wrap"
        sx={{
          px: 2.5,
          py: 1.25,
          borderRadius: tokens.semantic.radius.lg.value,
          backgroundColor: tokens.semantic.color.surface.variant.value,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: tokens.semantic.color.type.muted.value,
            letterSpacing: 1.5,
            fontSize: "0.65rem",
          }}
        >
          Security monitoring agents
        </Typography>
        {monitoringAgents.map((agent, i) => (
          <Stack key={agent.name} direction="row" alignItems="center" spacing={0.75}>
            {i > 0 && (
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  backgroundColor: tokens.semantic.color.type.muted.value,
                  opacity: 0.4,
                }}
              />
            )}
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
              }}
            />
            <Typography variant="caption" fontWeight={600}>
              {agent.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: tokens.semantic.color.type.muted.value }}
            >
              · {agent.lastRun}, {agent.nextRun}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function ClearBanner({ tokens }: { tokens: ReturnType<typeof useTheme>["tokens"] }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: tokens.semantic.radius.lg.value,
        backgroundColor: tokens.semantic.color.surface.default.value,
        border: `1px solid ${tokens.semantic.color.outline.default.value}`,
        textAlign: "center",
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: tokens.semantic.color.status.success.background.value,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: tokens.semantic.color.status.success.text.value,
          }}
        >
          <CheckedCircleIcon style={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h5" fontWeight={700}>
          Your IT security posture is in good shape.
        </Typography>
        <Typography
          variant="textSm"
          sx={{ color: tokens.semantic.color.type.muted.value, maxWidth: 560 }}
        >
          All systems are patched, monitoring agents active, and compliance frameworks current.
          A good time to review risk assessments and optimize your security posture.
        </Typography>
      </Stack>
    </Paper>
  );
}

function AlertsBanner({
  tokens,
  navigate,
}: {
  tokens: ReturnType<typeof useTheme>["tokens"];
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <>
      {/* Section header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          Needs your attention
        </Typography>
        <Chip
          label={`${notifications.length} items`}
          size="small"
          variant="outlined"
        />
      </Stack>

      {/* Notification cards */}
      <Stack spacing={2}>
        {notifications.map((notification) => {
          const config = severityConfig[notification.severity];
          return (
            <Paper
              key={notification.id}
              elevation={0}
              sx={{
                border: `1px solid ${tokens.semantic.color.outline.default.value}`,
                borderLeft: `4px solid ${config.borderColor}`,
                borderRadius: tokens.semantic.radius.lg.value,
                backgroundColor: config.bg,
                p: 2.5,
                transition: "box-shadow 0.15s",
                "&:hover": { boxShadow: 1 },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: config.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: config.borderColor,
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {notification.icon}
                </Box>

                <Stack spacing={0.75} flex={1} sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {notification.title}
                    </Typography>
                    <Chip
                      label={config.chipLabel}
                      size="small"
                      color={config.chipColor}
                      sx={{ height: 22, fontSize: "0.7rem" }}
                    />
                  </Stack>

                  <Typography
                    variant="textSm"
                    sx={{ color: tokens.semantic.color.type.muted.value }}
                  >
                    {notification.description}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{ color: tokens.semantic.color.type.muted.value }}
                  >
                    {notification.metadata}
                  </Typography>
                </Stack>

                <Button
                  variant={config.buttonVariant}
                  color={config.buttonColor}
                  size="small"
                  sx={{ flexShrink: 0, alignSelf: "center" }}
                  onClick={notification.route ? () => navigate(notification.route!) : undefined}
                >
                  {notification.actionLabel}
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </>
  );
}
