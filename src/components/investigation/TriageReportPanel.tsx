import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

const AFFECTED_ASSETS = [
  { system: "Financial Reporting Platform", assets: 5, environment: "Production" },
  { system: "HR Management System", assets: 4, environment: "Production" },
  { system: "Customer Portal", assets: 3, environment: "Staging" },
];

const COMPLIANCE_FRAMEWORKS = ["SOC 2 Type II", "ISO 27001", "NIST CSF", "PCI DSS"];

const RISK_ENTRIES = [
  { id: "R-2024-089", name: "Third-Party Software Risk", severity: "High" as const },
  { id: "R-2024-112", name: "Endpoint Protection Gap", severity: "Medium" as const },
];

interface TriageReportPanelProps {
  completed: boolean;
  onProceed: () => void;
}

export default function TriageReportPanel({ completed, onProceed }: TriageReportPanelProps) {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.fixed.value;
  const radius = tokens.semantic.radius.md.value;
  const surface = tokens.semantic.color.surface.default.value;

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          Automated triage report
        </Typography>
        <Chip
          label={completed ? "Completed" : "In progress"}
          size="small"
          color={completed ? "success" : "default"}
          variant="outlined"
        />
      </Stack>

      {/* CVE details */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}` }}>
        <Typography variant="textSm" fontWeight={600} sx={{ mb: 1.5 }}>
          CVE details
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <DetailCell label="CVE ID" value="CVE-2026-1847" />
          <DetailCell label="CVSS score" value="9.8 — Critical" valueColor={tokens.semantic.color.status.error.text.value} />
          <DetailCell label="Affected software" value="CrowdStrike Falcon Sensor v7.x" />
          <DetailCell label="Description" value="Remote code execution via kernel driver" />
        </Box>
      </Paper>

      {/* Affected assets */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Affected assets</Typography>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", "& th, & td": { px: 2.5, py: 1.25, textAlign: "left" } }}>
            <Box component="thead">
              <Box component="tr" sx={{ borderBottom: `1px solid ${outline}` }}>
                <Box component="th"><Typography variant="caption" sx={{ color: muted, fontWeight: 600 }}>System</Typography></Box>
                <Box component="th" sx={{ textAlign: "right" }}><Typography variant="caption" sx={{ color: muted, fontWeight: 600 }}>Assets</Typography></Box>
                <Box component="th"><Typography variant="caption" sx={{ color: muted, fontWeight: 600 }}>Environment</Typography></Box>
              </Box>
            </Box>
            <Box component="tbody">
              {AFFECTED_ASSETS.map((row) => (
                <Box component="tr" key={row.system} sx={{ borderBottom: `1px solid ${outline}` }}>
                  <Box component="td"><Typography variant="textSm" fontWeight={500}>{row.system}</Typography></Box>
                  <Box component="td" sx={{ textAlign: "right" }}><Typography variant="textSm">{row.assets}</Typography></Box>
                  <Box component="td"><Chip label={row.environment} size="small" variant="outlined" /></Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Typography variant="caption" sx={{ color: muted, px: 2.5, py: 1.5, display: "block" }}>
          12 total assets affected across 3 business-critical systems
        </Typography>
      </Paper>

      {/* Compliance impact */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Compliance impact</Typography>
        </Box>
        <Box sx={{ p: 2.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {COMPLIANCE_FRAMEWORKS.map((fw) => (
            <Chip key={fw} label={fw} size="small" variant="outlined" />
          ))}
        </Box>
      </Paper>

      {/* Risk register */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Risk register</Typography>
        </Box>
        <Stack divider={<Divider />}>
          {RISK_ENTRIES.map((entry) => (
            <Stack key={entry.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.5 }}>
              <Stack spacing={0.25}>
                <Typography variant="textSm" fontWeight={500}>{entry.name}</Typography>
                <Typography variant="caption" sx={{ color: muted }}>{entry.id}</Typography>
              </Stack>
              <Chip label={entry.severity} size="small" color={entry.severity === "High" ? "error" : "default"} variant="outlined" />
            </Stack>
          ))}
        </Stack>
      </Paper>

      {/* Materiality assessment */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}` }}>
        <Typography variant="textSm" fontWeight={600} sx={{ mb: 1 }}>Materiality assessment</Typography>
        <Typography variant="textSm" sx={{ color: muted, lineHeight: 1.6 }}>
          Based on the scope of affected assets and compliance frameworks impacted, this incident meets the threshold for material disclosure consideration.
        </Typography>
      </Paper>

      <Divider />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={onProceed}>
          Proceed to notifications
        </Button>
      </Stack>
    </Stack>
  );
}

function DetailCell({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const { tokens } = useTheme();
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value }}>{label}</Typography>
      <Typography variant="textSm" fontWeight={500} sx={valueColor ? { color: valueColor } : undefined}>{value}</Typography>
    </Stack>
  );
}
