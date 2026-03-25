import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

const FAILED_CONTROLS = [
  { id: "AC-7", name: "Endpoint Protection", finding: "Unpatched kernel driver" },
  { id: "RA-5", name: "Vulnerability Scanning", finding: "Detection delay > 24hrs" },
  { id: "SI-2", name: "Flaw Remediation", finding: "Patch not applied within SLA" },
  { id: "SA-9", name: "External System Services", finding: "Vendor patch dependency" },
];

const ITSM_TICKETS = [
  { id: "INC-2847", title: "Emergency patch deployment", priority: "Critical" as const, status: "In Progress" },
  { id: "INC-2848", title: "Asset isolation review", priority: "High" as const, status: "Open" },
  { id: "INC-2849", title: "Compensating controls", priority: "High" as const, status: "Open" },
  { id: "CHG-1923", title: "Emergency change request", priority: "Critical" as const, status: "Approved" },
  { id: "PRB-0847", title: "Root cause analysis", priority: "Medium" as const, status: "Open" },
];

interface RemediationPanelProps {
  onProceed: () => void;
}

export default function RemediationPanel({ onProceed }: RemediationPanelProps) {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.fixed.value;
  const radius = tokens.semantic.radius.md.value;
  const surface = tokens.semantic.color.surface.default.value;

  const ticketsCreated = 2;

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>Remediation plan</Typography>
        <Typography variant="textSm" sx={{ color: muted }}>
          {ticketsCreated} of {ITSM_TICKETS.length} tickets created
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={(ticketsCreated / ITSM_TICKETS.length) * 100}
        sx={{ height: 6, borderRadius: 1, backgroundColor: outline, "& .MuiLinearProgress-bar": { borderRadius: 1 } }}
      />

      {/* Failed controls */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Failed controls linked</Typography>
        </Box>
        <Stack divider={<Divider />}>
          {FAILED_CONTROLS.map((control) => (
            <Stack key={control.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Chip label={control.id} size="small" variant="outlined" sx={{ fontFamily: "monospace", fontSize: "0.7rem" }} />
                <Typography variant="textSm" fontWeight={500}>{control.name}</Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: muted, flexShrink: 0 }}>{control.finding}</Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      {/* ITSM tickets */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>ITSM tickets</Typography>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", "& th, & td": { px: 2.5, py: 1.25, textAlign: "left" } }}>
            <Box component="thead">
              <Box component="tr" sx={{ borderBottom: `1px solid ${outline}` }}>
                <Box component="th"><Typography variant="caption" sx={{ color: muted, fontWeight: 600 }}>ID</Typography></Box>
                <Box component="th"><Typography variant="caption" sx={{ color: muted, fontWeight: 600 }}>Title</Typography></Box>
                <Box component="th"><Typography variant="caption" sx={{ color: muted, fontWeight: 600 }}>Priority</Typography></Box>
                <Box component="th"><Typography variant="caption" sx={{ color: muted, fontWeight: 600 }}>Status</Typography></Box>
              </Box>
            </Box>
            <Box component="tbody">
              {ITSM_TICKETS.map((ticket) => (
                <Box component="tr" key={ticket.id} sx={{ borderBottom: `1px solid ${outline}` }}>
                  <Box component="td"><Typography variant="caption" sx={{ fontFamily: "monospace" }}>{ticket.id}</Typography></Box>
                  <Box component="td"><Typography variant="textSm" fontWeight={500}>{ticket.title}</Typography></Box>
                  <Box component="td">
                    <Chip
                      label={ticket.priority}
                      size="small"
                      color={ticket.priority === "Critical" ? "error" : ticket.priority === "High" ? "warning" : "default"}
                      variant="outlined"
                    />
                  </Box>
                  <Box component="td"><Chip label={ticket.status} size="small" variant="outlined" /></Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Divider />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={onProceed}>
          Continue to third-party review
        </Button>
      </Stack>
    </Stack>
  );
}
