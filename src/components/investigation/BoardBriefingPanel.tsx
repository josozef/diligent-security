import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

const BOARD_RECIPIENTS = [
  { id: "audit", label: "Audit Committee", checked: true },
  { id: "risk", label: "Risk Committee", checked: true },
  { id: "full", label: "Full Board", checked: false },
];

const EXECUTIVE_SUMMARY = `Security Incident Report — CVE-2026-1847

EXECUTIVE SUMMARY
On March 18, 2026, a critical remote code execution vulnerability (CVE-2026-1847, CVSS 9.8) was identified in the CrowdStrike Falcon Sensor v7.x kernel driver deployed across our enterprise environment. The vulnerability was triaged within 15 minutes of disclosure, and a coordinated response was initiated through our automated incident governance workflow.

IMPACT ASSESSMENT
Twelve assets across three business-critical systems were affected: Financial Reporting Platform (5 assets), HR Management System (4 assets), and Customer Portal (3 assets). Four compliance frameworks — SOC 2 Type II, ISO 27001, NIST CSF, and PCI DSS — were assessed for impact. The incident meets the threshold for material disclosure consideration under SEC reporting guidelines.

RESPONSE TIMELINE
The incident was detected at 06:42 UTC and triaged by 06:57 UTC. Stakeholder notifications were dispatched at 07:05 UTC. Emergency patching commenced at 07:30 UTC with compensating controls deployed in parallel. Full remediation was achieved by 13:15 UTC, within the 24-hour critical SLA window.

REMEDIATION ACTIONS
Five ITSM tickets were created, including emergency patch deployment, asset isolation review, and compensating controls implementation. An emergency change request (CHG-1923) was approved and executed. Network segmentation was applied to contain potential lateral movement, and secondary EDR monitoring was activated during the remediation window.

COMPLIANCE STATUS
All four impacted compliance frameworks have been reviewed. Control deficiencies in AC-7 (Endpoint Protection), RA-5 (Vulnerability Scanning), SI-2 (Flaw Remediation), and SA-9 (External System Services) have been documented. Corrective action plans are in progress, and an updated risk assessment has been filed in the risk register.

RECOMMENDATIONS
Management recommends (1) accelerating the vendor assessment cycle for critical security vendors from annual to semi-annual, (2) implementing automated patch deployment for kernel-level security updates, and (3) engaging external counsel to evaluate disclosure obligations under SEC cybersecurity rules. A follow-up briefing is scheduled for the next regular committee meeting.`;

interface BoardBriefingPanelProps {
  onComplete: () => void;
}

export default function BoardBriefingPanel({ onComplete }: BoardBriefingPanelProps) {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.fixed.value;
  const radius = tokens.semantic.radius.md.value;
  const surface = tokens.semantic.color.surface.default.value;

  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        Board briefing — Executive summary
      </Typography>

      {/* Recipients */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Recipients</Typography>
        </Box>
        <Stack divider={<Divider />}>
          {BOARD_RECIPIENTS.map((r) => (
            <Stack key={r.id} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2.5, py: 1.25 }}>
              <Checkbox size="small" checked={r.checked} disabled sx={{ p: 0.5 }} />
              <Typography variant="textSm">{r.label}</Typography>
              {r.checked && <Chip label="Selected" size="small" variant="outlined" sx={{ ml: "auto" }} />}
            </Stack>
          ))}
        </Stack>
      </Paper>

      {/* Briefing document */}
      <Paper elevation={0} sx={{ borderRadius: radius, backgroundColor: surface, border: `1px solid ${outline}`, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${outline}` }}>
          <Typography variant="textSm" fontWeight={600}>Briefing document</Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: radius, backgroundColor: tokens.semantic.color.surface.variant.value }}>
            <Typography
              variant="textSm"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: tokens.semantic.color.type.default.value }}
            >
              {EXECUTIVE_SUMMARY}
            </Typography>
          </Paper>
        </Box>
      </Paper>

      <Divider />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        <Button variant="outlined">Edit briefing</Button>
        <Button variant="contained" onClick={onComplete}>
          Send to committee
        </Button>
      </Stack>
    </Stack>
  );
}
