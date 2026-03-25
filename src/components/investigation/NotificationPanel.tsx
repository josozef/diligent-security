import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

const RECIPIENTS = [
  { name: "Sarah Chen", initials: "SC", role: "CISO", action: "Immediate escalation" },
  { name: "Mike Rodriguez", initials: "MR", role: "IT Asset Owner (Financial)", action: "Asset impact briefing" },
  { name: "Jennifer Walsh", initials: "JW", role: "General Counsel", action: "Regulatory assessment" },
  { name: "David Kim", initials: "DK", role: "Vendor Management", action: "Third-party review" },
];

interface NotificationPanelProps {
  onProceed: () => void;
}

export default function NotificationPanel({ onProceed }: NotificationPanelProps) {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.fixed.value;
  const radius = tokens.semantic.radius.md.value;
  const surface = tokens.semantic.color.surface.default.value;

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        Stakeholder notifications
      </Typography>

      {/* Recipients */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Recipients</Typography>
        </Box>
        <Stack divider={<Divider />}>
          {RECIPIENTS.map((person) => (
            <Stack key={person.name} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2.5, py: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: "0.6rem", fontWeight: 700, bgcolor: tokens.semantic.color.action.primary.default.value, color: tokens.semantic.color.action.primary.onPrimary.value }}>
                {person.initials}
              </Avatar>
              <Stack spacing={0} flex={1} minWidth={0}>
                <Typography variant="textSm" fontWeight={500}>{person.name}</Typography>
                <Typography variant="caption" sx={{ color: muted }}>{person.role}</Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: muted, flexShrink: 0 }}>{person.action}</Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      {/* Notification preview */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Notification preview</Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: radius, backgroundColor: tokens.semantic.color.surface.variant.value }}>
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ color: muted }}>Subject</Typography>
                <Typography variant="textSm" fontWeight={600}>
                  CRITICAL: CVE-2026-1847 — Immediate action required
                </Typography>
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="textSm" sx={{ color: muted }}>
                  A critical vulnerability (CVSS 9.8) has been identified in CrowdStrike Falcon Sensor v7.x deployed across our environment. Immediate action is required.
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, "& li": { mb: 0.75 } }}>
                  <Typography component="li" variant="textSm" sx={{ color: muted }}>
                    <Box component="span" sx={{ fontWeight: 600, color: tokens.semantic.color.type.default.value }}>12 assets</Box> affected across 3 business-critical systems
                  </Typography>
                  <Typography component="li" variant="textSm" sx={{ color: muted }}>
                    <Box component="span" sx={{ fontWeight: 600, color: tokens.semantic.color.type.default.value }}>4 compliance frameworks</Box> at risk: SOC 2, ISO 27001, NIST CSF, PCI DSS
                  </Typography>
                  <Typography component="li" variant="textSm" sx={{ color: muted }}>
                    <Box component="span" sx={{ fontWeight: 600, color: tokens.semantic.color.type.default.value }}>Remediation window:</Box> 24 hours per policy SLA
                  </Typography>
                  <Typography component="li" variant="textSm" sx={{ color: muted }}>
                    <Box component="span" sx={{ fontWeight: 600, color: tokens.semantic.color.type.default.value }}>Materiality threshold</Box> met — disclosure review initiated
                  </Typography>
                </Box>
                <Typography variant="textSm" sx={{ color: muted }}>
                  An incident response workflow has been activated. You will receive updates as remediation progresses.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Chip label="Auto-generated" size="small" variant="outlined" />
                <Chip label="Context-aware" size="small" variant="outlined" />
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Paper>

      <Divider />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={onProceed}>
          Send notifications &amp; continue
        </Button>
      </Stack>
    </Stack>
  );
}
