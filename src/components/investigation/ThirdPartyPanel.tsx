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
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";

const COMPENSATING_CONTROLS = [
  "Network segmentation applied to affected endpoints",
  "Enhanced monitoring via secondary EDR tool",
  "Manual threat hunting initiated",
];

interface ThirdPartyPanelProps {
  onProceed: () => void;
}

export default function ThirdPartyPanel({ onProceed }: ThirdPartyPanelProps) {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.fixed.value;
  const radius = tokens.semantic.radius.md.value;
  const surface = tokens.semantic.color.surface.default.value;

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        Third-party vendor review
      </Typography>

      {/* Vendor card */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="textSm" fontWeight={600}>CrowdStrike</Typography>
            <Chip label="Medium Risk" size="small" variant="outlined" />
          </Stack>
        </Box>
        <Stack spacing={0} divider={<Divider />}>
          <Box sx={{ px: 2.5, py: 1.5, backgroundColor: tokens.semantic.color.status.error.background.value }}>
            <Stack spacing={0.25}>
              <Typography variant="textSm" fontWeight={600}>SLA status — Breach</Typography>
              <Typography variant="caption" sx={{ color: muted }}>
                Patch delivery exceeded 4-hour SLA by 2 hours
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ px: 2.5, py: 1.5 }}>
            <Stack spacing={0.25}>
              <Typography variant="textSm" fontWeight={600}>Historical performance</Typography>
              <Typography variant="caption" sx={{ color: muted }}>
                99.2% uptime, 3 incidents in 12 months
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ px: 2.5, py: 1.5 }}>
            <Stack spacing={0.25}>
              <Typography variant="textSm" fontWeight={600}>Last assessment</Typography>
              <Typography variant="caption" sx={{ color: muted }}>January 15, 2026</Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Compensating controls */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Compensating controls</Typography>
        </Box>
        <Stack divider={<Divider />}>
          {COMPENSATING_CONTROLS.map((control) => (
            <Stack key={control} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2.5, py: 1.5 }}>
              <CheckedCircleIcon style={{ fontSize: 18, color: tokens.semantic.color.status.success.default.value, flexShrink: 0 }} />
              <Typography variant="textSm">{control}</Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      <Divider />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={onProceed}>
          Continue to resolution
        </Button>
      </Stack>
    </Stack>
  );
}
