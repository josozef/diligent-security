import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import VirusFoundIcon from "@diligentcorp/atlas-react-bundle/icons/VirusFound";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  department: string;
  initials: string;
  reason: string;
}

interface NotificationPreviewPanelProps {
  recipients: Stakeholder[];
  sent?: boolean;
  sentAt?: string;
  onBack?: () => void;
  onSend?: () => void;
}

export default function NotificationPreviewPanel({
  recipients,
  sent,
  sentAt,
  onBack,
  onSend,
}: NotificationPreviewPanelProps) {
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {onBack && (
              <IconButton size="small" onClick={onBack}>
                <ArrowLeftIcon />
              </IconButton>
            )}
            <Typography variant="subtitle1" fontWeight={600}>
              Notification preview
            </Typography>
          </Stack>
          {sent && (
            <StatusIndicator
              icon={<CheckedCircleIcon />}
              label={`Sent ${sentAt}`}
              size="small"
              color="success"
            />
          )}
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
          {/* Recipients card */}
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
                  Recipients
                </Typography>
                <Chip
                  label={`${recipients.length}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
            <Stack divider={<Divider />}>
              {recipients.map((r) => (
                <Stack
                  key={r.id}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ px: 2, py: 1.25 }}
                >
                  <Stack spacing={0} sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" fontWeight={500}>
                      {r.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: tokens.semantic.color.type.muted.value,
                        fontSize: "0.675rem",
                      }}
                    >
                      {r.title} · {r.department}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Primary CTA: send from right panel after reviewing preview */}
          {!sent && onSend && recipients.length > 0 && (
            <Button
              variant="contained"
              fullWidth
              size="medium"
              onClick={onSend}
              sx={{ mt: 1.5 }}
            >
              Send notifications to {recipients.length} stakeholder{recipients.length !== 1 ? "s" : ""}
            </Button>
          )}

          {/* Message preview card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              overflow: "hidden",
            }}
          >
            {/* Message header */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                backgroundColor:
                  tokens.semantic.color.status.error.background.value,
                borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor:
                      tokens.semantic.color.status.error.default.value,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      tokens.semantic.color.status.error.text.value,
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
                    <Typography
                      variant="caption"
                      sx={{
                        color: tokens.semantic.color.type.muted.value,
                      }}
                    >
                      CVE-2026-1847 · CVSS 9.8
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* Message body */}
            <Box sx={{ px: 2, py: 2 }}>
              <Stack spacing={1.5}>
                <Typography variant="caption">
                  You're receiving this because you own or are responsible for
                  assets affected by a critical security vulnerability that
                  requires immediate action.
                </Typography>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: tokens.semantic.radius.sm.value,
                    backgroundColor:
                      tokens.semantic.color.surface.variant.value,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ display: "block", mb: 0.75 }}
                  >
                    Incident summary
                  </Typography>
                  <Stack spacing={0.25}>
                    <DetailRow
                      label="Vulnerability"
                      value="CVE-2026-1847 (CVSS 9.8)"
                    />
                    <DetailRow
                      label="Vendor"
                      value="CrowdStrike Falcon Sensor for Windows"
                    />
                    <DetailRow
                      label="Type"
                      value="Remote code execution (heap overflow)"
                    />
                    <DetailRow
                      label="Exploit status"
                      value="Active exploitation confirmed"
                    />
                    <DetailRow
                      label="Affected assets"
                      value="12 assets across 3 business-critical systems"
                    />
                    <DetailRow
                      label="Detected"
                      value="Today, 2:14 PM EST"
                    />
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: tokens.semantic.radius.sm.value,
                    backgroundColor:
                      tokens.semantic.color.surface.variant.value,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    Compliance frameworks at risk
                  </Typography>
                  <Stack spacing={0}>
                    <Typography variant="caption">
                      · SOC 2 Type II — CC6.1, CC7.2
                    </Typography>
                    <Typography variant="caption">
                      · ISO 27001:2022 — A.12.6.1
                    </Typography>
                    <Typography variant="caption">
                      · NIST CSF 2.0 — ID.RA-1
                    </Typography>
                    <Typography variant="caption">
                      · PCI DSS v4.0 — Req 6.3.3
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: tokens.semantic.radius.sm.value,
                    border: `1px solid ${tokens.semantic.color.status.error.default.value}`,
                    backgroundColor:
                      tokens.semantic.color.status.error.background.value,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ display: "block", mb: 0.25 }}
                  >
                    Required action
                  </Typography>
                  <Typography variant="caption">
                    Review the affected assets you own, confirm business impact,
                    and coordinate with the security team on the remediation
                    timeline. Patch deployment is expected within 24 hours for
                    production systems.
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: tokens.semantic.color.type.muted.value,
                    fontSize: "0.65rem",
                  }}
                >
                  This notification was generated by the Diligent Security
                  Incident Governance workflow.
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Stack>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { tokens } = useTheme();
  return (
    <Stack direction="row" spacing={2}>
      <Typography
        variant="caption"
        sx={{
          color: tokens.semantic.color.type.muted.value,
          minWidth: 100,
          flexShrink: 0,
          fontSize: "0.675rem",
        }}
      >
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={500} sx={{ fontSize: "0.675rem" }}>
        {value}
      </Typography>
    </Stack>
  );
}
