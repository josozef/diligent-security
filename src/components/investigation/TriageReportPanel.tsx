import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import VirusFoundIcon from "@diligentcorp/atlas-react-bundle/icons/VirusFound";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";

const affectedAssets = [
  { name: "PROD-PAY-01 through 04", system: "Payment processing cluster", criticality: "Critical", environment: "Production" },
  { name: "PROD-CDP-01 through 05", system: "Customer data platform", criticality: "Critical", environment: "Production" },
  { name: "HR-WEB-01, HR-APP-01, STG-HR-01", system: "Internal HR portal", criticality: "High", environment: "Prod + Staging" },
];

const complianceImpact = [
  { framework: "SOC 2 Type II", controls: ["CC6.1 – Logical access controls", "CC7.2 – System monitoring and anomaly detection"], status: "At risk" },
  { framework: "ISO 27001:2022", controls: ["A.12.6.1 – Technical vulnerability management"], status: "At risk" },
  { framework: "NIST CSF 2.0", controls: ["ID.RA-1 – Asset vulnerabilities identified and documented"], status: "At risk" },
  { framework: "PCI DSS v4.0", controls: ["Req 6.3.3 – Patch critical vulnerabilities within 30 days"], status: "At risk" },
];

const riskRegisterEntries = [
  { id: "IR-2024-017", name: "Third-party endpoint agent compromise", inherentScore: "Critical (25)", residualScore: "Critical (20)" },
  { id: "IR-2024-003", name: "Unauthorized access to payment systems", inherentScore: "High (16)", residualScore: "High (12)" },
];

export default function TriageReportPanel({
  onBack,
  onNotifyStakeholders,
}: {
  onBack?: () => void;
  onNotifyStakeholders?: () => void;
}) {
  const { tokens } = useTheme();

  return (
    <Stack spacing={0} sx={{ height: "100%" }}>
      {/* Panel header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          backgroundColor: tokens.semantic.color.surface.default.value,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {onBack && (
            <IconButton size="small" onClick={onBack}>
              <ArrowLeftIcon />
            </IconButton>
          )}
          <Typography variant="subtitle1" fontWeight={600}>
            Incident triage report
          </Typography>
        </Stack>
      </Box>

      {/* Scrollable body */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          backgroundColor: tokens.semantic.color.surface.subtle.value,
        }}
      >
        <Stack spacing={1.5}>
          {/* Incident overview */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <VirusFoundIcon
                  style={{
                    fontSize: 20,
                    color: tokens.semantic.color.status.error.text.value,
                  }}
                />
                <Typography variant="textSm" fontWeight={600}>
                  CVE-2026-1847
                </Typography>
                <Chip label="CVSS 9.8" size="small" color="error" />
              </Stack>
              <Stack spacing={0.25}>
                <Row label="Vendor" value="CrowdStrike" />
                <Row label="Product" value="Falcon Sensor for Windows" />
                <Row label="Affected versions" value="< 7.14.18110" />
                <Row label="Type" value="Remote code execution (heap overflow)" />
                <Row label="Exploit status" value="Active exploitation confirmed" />
                <Row label="Detection source" value="Tenable scanner + Threat intel feed" />
                <Row label="Detected" value="Today, 2:14 PM EST" />
              </Stack>
            </Stack>
          </Paper>

          {/* Triage progress */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="textSm" fontWeight={600}>
                  Triage progress
                </Typography>
                <StatusIndicator
                  icon={<CheckedCircleIcon />}
                  label="5 / 5"
                  size="small"
                  color="success"
                />
              </Stack>
              <Stack spacing={0.5}>
                <TriageStep label="Incident detection and classification" />
                <TriageStep label="Asset scan and impact mapping" />
                <TriageStep label="Compliance framework cross-reference" />
                <TriageStep label="Risk register correlation" />
                <TriageStep label="Initial risk assessment" />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={100}
                color="success"
                sx={{ borderRadius: 1, height: 5 }}
              />
            </Stack>
          </Paper>

          {/* Affected assets */}
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
                borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="textSm" fontWeight={600}>
                  Affected assets
                </Typography>
                <Chip label="12 assets" size="small" variant="outlined" />
              </Stack>
            </Box>
            <Stack divider={<Divider />}>
              {affectedAssets.map((asset) => (
                <Box key={asset.name} sx={{ px: 2, py: 1.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Stack spacing={0.25}>
                      <Typography variant="textSm" fontWeight={500}>
                        {asset.system}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: tokens.semantic.color.type.muted.value,
                        }}
                      >
                        {asset.name}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ flexShrink: 0, ml: 1 }}
                    >
                      <Chip
                        label={asset.criticality}
                        size="small"
                        color={
                          asset.criticality === "Critical" ? "error" : "warning"
                        }
                      />
                      <Chip
                        label={asset.environment}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Compliance impact */}
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
                borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="textSm" fontWeight={600}>
                  Compliance impact
                </Typography>
                <Chip
                  label="4 frameworks"
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
            <Stack divider={<Divider />}>
              {complianceImpact.map((item) => (
                <Box key={item.framework} sx={{ px: 2, py: 1.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="textSm" fontWeight={500}>
                      {item.framework}
                    </Typography>
                    <StatusIndicator label={item.status} size="small" color="warning" />
                  </Stack>
                  <Stack spacing={0}>
                    {item.controls.map((ctrl) => (
                      <Typography
                        key={ctrl}
                        variant="caption"
                        sx={{
                          color: tokens.semantic.color.type.muted.value,
                        }}
                      >
                        {ctrl}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Risk register */}
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
                borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              }}
            >
              <Typography variant="textSm" fontWeight={600}>
                Risk register entries
              </Typography>
            </Box>
            <Stack divider={<Divider />}>
              {riskRegisterEntries.map((entry) => (
                <Box key={entry.id} sx={{ px: 2, py: 1.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 0.25 }}
                  >
                    <Typography variant="textSm" fontWeight={500}>
                      {entry.id}
                    </Typography>
                    <Chip
                      label={entry.inherentScore.split(" ")[0]}
                      size="small"
                      color="error"
                    />
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      color: tokens.semantic.color.type.muted.value,
                      display: "block",
                    }}
                  >
                    {entry.name}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: tokens.semantic.color.type.muted.value,
                      }}
                    >
                      Inherent: {entry.inherentScore}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: tokens.semantic.color.type.muted.value,
                      }}
                    >
                      Residual: {entry.residualScore}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Materiality assessment */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.status.error.background.value,
              border: `1px solid ${tokens.semantic.color.status.error.default.value}`,
            }}
          >
            <Stack spacing={0.75}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="textSm" fontWeight={600}>
                  Materiality assessment
                </Typography>
                <StatusIndicator label="Requires review" size="small" color="error" />
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: tokens.semantic.color.type.muted.value }}
              >
                Active exploit targeting production payment processing
                infrastructure in PCI scope. Potential customer data exposure
                across 5 customer data platform servers. Recommend immediate
                escalation to CISO and General Counsel for SEC 8-K / 10-K
                evaluation.
              </Typography>
            </Stack>
          </Paper>

          {/* Recommended next steps */}
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
                borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              }}
            >
              <Typography variant="textSm" fontWeight={600}>
                Recommended next steps
              </Typography>
            </Box>
            <Stack divider={<Divider />}>
              <NextStep
                number={1}
                label="Notify stakeholders"
                description="Route context-aware alerts to asset owners, CISO, and General Counsel."
              />
              <NextStep
                number={2}
                label="Initiate remediation"
                description="Create ITSM tickets for affected assets and coordinate patching schedule."
              />
              <NextStep
                number={3}
                label="Third-party review"
                description="Assess CrowdStrike vendor record, SLAs, and compensating controls."
              />
              <NextStep
                number={4}
                label="Board briefing"
                description="Generate executive summary for audit/risk committee review."
              />
            </Stack>
          </Paper>

          {/* Primary CTA: start notify step from right panel after reviewing triage */}
          {onNotifyStakeholders && (
            <Button
              variant="contained"
              fullWidth
              size="medium"
              onClick={onNotifyStakeholders}
              sx={{ mt: 0.5 }}
            >
              Notify stakeholders
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { tokens } = useTheme();
  return (
    <Stack direction="row" spacing={2}>
      <Typography
        variant="caption"
        sx={{
          color: tokens.semantic.color.type.muted.value,
          minWidth: 110,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={500}>
        {value}
      </Typography>
    </Stack>
  );
}

function TriageStep({ label }: { label: string }) {
  const { tokens } = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <CheckedCircleIcon
        style={{
          fontSize: 16,
          color: tokens.semantic.color.status.success.text.value,
        }}
      />
      <Typography variant="caption">{label}</Typography>
    </Stack>
  );
}

function NextStep({
  number,
  label,
  description,
}: {
  number: number;
  label: string;
  description: string;
}) {
  const { tokens } = useTheme();
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{ px: 2, py: 1.5 }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: tokens.semantic.color.action.primary.default.value,
          color: tokens.semantic.color.action.primary.onPrimary.value,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.65rem",
          fontWeight: 700,
          flexShrink: 0,
          mt: 0.125,
        }}
      >
        {number}
      </Box>
      <Stack spacing={0}>
        <Typography variant="textSm" fontWeight={600}>
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: tokens.semantic.color.type.muted.value }}
        >
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
