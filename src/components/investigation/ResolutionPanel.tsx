import {
  Box,
  Button,
  Checkbox,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

const CHECKLIST = [
  { id: "patches", label: "All patches applied and verified" },
  { id: "vulns", label: "No residual vulnerabilities detected" },
  { id: "controls", label: "Compensating controls removed" },
  { id: "owners", label: "Asset owners confirmed operational status" },
  { id: "evidence", label: "Evidence pack compiled (23 artifacts)" },
];

interface ResolutionPanelProps {
  onProceed: () => void;
}

export default function ResolutionPanel({ onProceed }: ResolutionPanelProps) {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.fixed.value;
  const radius = tokens.semantic.radius.md.value;
  const surface = tokens.semantic.color.surface.default.value;

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        Resolution &amp; verification
      </Typography>

      {/* Patch status */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, p: 2.5 }}>
        <Typography variant="textSm" fontWeight={600} sx={{ mb: 1.5 }}>Patch status</Typography>
        <LinearProgress
          variant="determinate"
          value={100}
          color="success"
          sx={{ height: 6, borderRadius: 1, mb: 1 }}
        />
        <Typography variant="textSm" sx={{ color: muted }}>All 12 assets patched successfully</Typography>
      </Paper>

      {/* Verification checklist */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Verification checklist</Typography>
        </Box>
        <Stack divider={<Divider />}>
          {CHECKLIST.map((item) => (
            <Stack key={item.id} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2.5, py: 1.25 }}>
              <Checkbox size="small" checked disabled sx={{ p: 0.5 }} />
              <Typography variant="textSm">{item.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      <Divider />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={onProceed}>
          Generate board briefing
        </Button>
      </Stack>
    </Stack>
  );
}
