import {
  Avatar,
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
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import ClockIcon from "@diligentcorp/atlas-react-bundle/icons/Clock";
import WarningIcon from "@diligentcorp/atlas-react-bundle/icons/Warning";

export interface RemediationTicket {
  id: string;
  title: string;
  system: string;
  assets: string;
  priority: "Critical" | "High" | "Medium";
  owner: string;
  ownerInitials: string;
  dueDate: string;
  status: "Open" | "In progress" | "Complete";
  patchWindow: string;
}

interface RemediationPlanPanelProps {
  tickets: RemediationTicket[];
  failedControls: { control: string; policy: string; framework: string }[];
  relatedThreats: { threat: string; category: string }[];
  onBack?: () => void;
  onInitiateRemediation?: () => void;
  remediationStarted?: boolean;
}

export default function RemediationPlanPanel({
  tickets,
  failedControls,
  relatedThreats,
  onBack,
  onInitiateRemediation,
  remediationStarted,
}: RemediationPlanPanelProps) {
  const { tokens } = useTheme();

  const completedCount = tickets.filter((t) => t.status === "Complete").length;
  const progressPercent =
    tickets.length > 0 ? (completedCount / tickets.length) * 100 : 0;

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
            Remediation plan
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
          {/* Progress overview card */}
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
                  Remediation progress
                </Typography>
                <StatusIndicator
                  label={`${completedCount} / ${tickets.length}`}
                  size="small"
                  color={
                    completedCount === tickets.length ? "success" : "warning"
                  }
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                color={
                  completedCount === tickets.length ? "success" : "warning"
                }
                sx={{ borderRadius: 1, height: 5 }}
              />
              <Typography
                variant="caption"
                sx={{ color: tokens.semantic.color.type.muted.value }}
              >
                {completedCount} of {tickets.length} remediation tickets
                created — patching sequence optimized by criticality
              </Typography>
            </Stack>
          </Paper>

          {/* Failed controls */}
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
                  Failed controls linked
                </Typography>
                <Chip
                  label={`${failedControls.length} controls`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
            <Stack divider={<Divider />}>
              {failedControls.map((fc) => (
                <Box key={fc.control} sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="caption" fontWeight={500}>
                    {fc.control}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 0.25 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: tokens.semantic.color.type.muted.value,
                        fontSize: "0.675rem",
                      }}
                    >
                      {fc.policy}
                    </Typography>
                    <Chip
                      label={fc.framework}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, "& .MuiChip-label": { px: 1, fontSize: "0.6rem" } }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Related threats */}
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
                Related threats
              </Typography>
            </Box>
            <Stack divider={<Divider />}>
              {relatedThreats.map((rt) => (
                <Stack
                  key={rt.threat}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ px: 2, py: 1.25 }}
                >
                  <WarningIcon
                    style={{
                      fontSize: 16,
                      color:
                        tokens.semantic.color.status.warning.text.value,
                    }}
                  />
                  <Stack spacing={0} sx={{ minWidth: 0 }}>
                    <Typography variant="caption" fontWeight={500}>
                      {rt.threat}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: tokens.semantic.color.type.muted.value,
                        fontSize: "0.675rem",
                      }}
                    >
                      {rt.category}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Remediation tickets */}
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
                  Remediation tickets
                </Typography>
                <Chip
                  label={`${tickets.length} tickets`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
            <Stack divider={<Divider />}>
              {tickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </Stack>
          </Paper>

          {/* Compensating controls */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor:
                tokens.semantic.color.status.warning.background.value,
              border: `1px solid ${tokens.semantic.color.status.warning.default.value}`,
            }}
          >
            <Stack spacing={0.75}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="textSm" fontWeight={600}>
                  Interim compensating controls
                </Typography>
                <StatusIndicator label="Active" size="small" color="warning" />
              </Stack>
              <Stack spacing={0.25}>
                <Typography variant="caption">
                  · Network segmentation applied to isolate affected production
                  servers
                </Typography>
                <Typography variant="caption">
                  · Enhanced monitoring rules activated for lateral movement
                  indicators
                </Typography>
                <Typography variant="caption">
                  · Temporary WAF rules deployed to block known exploit payloads
                </Typography>
                <Typography variant="caption">
                  · CrowdStrike prevention policy escalated to maximum
                  enforcement
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Primary CTA: start remediation from right panel after reviewing plan */}
          {!remediationStarted && onInitiateRemediation && (
            <Button
              variant="contained"
              fullWidth
              size="medium"
              onClick={onInitiateRemediation}
              sx={{ mt: 1.5 }}
            >
              Initiate remediation
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

function TicketRow({ ticket }: { ticket: RemediationTicket }) {
  const { tokens } = useTheme();

  const priorityColor =
    ticket.priority === "Critical"
      ? "error"
      : ticket.priority === "High"
        ? "warning"
        : ("default" as const);

  const statusIcon =
    ticket.status === "Complete" ? (
      <CheckedCircleIcon
        style={{
          fontSize: 14,
          color: tokens.semantic.color.status.success.text.value,
        }}
      />
    ) : (
      <ClockIcon
        style={{
          fontSize: 14,
          color: tokens.semantic.color.type.muted.value,
        }}
      />
    );

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{ color: tokens.semantic.color.type.muted.value }}
            >
              {ticket.id}
            </Typography>
            <Chip label={ticket.priority} size="small" color={priorityColor} />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {statusIcon}
            <Typography
              variant="caption"
              sx={{ color: tokens.semantic.color.type.muted.value }}
            >
              {ticket.status}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="caption" fontWeight={500}>
          {ticket.title}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mt: 0.25 }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Avatar
              sx={{
                width: 18,
                height: 18,
                fontSize: "0.5rem",
                fontWeight: 700,
                bgcolor:
                  tokens.semantic.color.action.primary.default.value,
                color:
                  tokens.semantic.color.action.primary.onPrimary.value,
              }}
            >
              {ticket.ownerInitials}
            </Avatar>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.675rem" }}
            >
              {ticket.owner}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: tokens.semantic.color.type.muted.value,
              fontSize: "0.675rem",
            }}
          >
            Due {ticket.dueDate}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

