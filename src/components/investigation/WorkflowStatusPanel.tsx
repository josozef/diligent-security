import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import ClockIcon from "@diligentcorp/atlas-react-bundle/icons/Clock";

export type PhaseStatus = "not-started" | "in-progress" | "complete";

export interface PhaseInfo {
  key: string;
  label: string;
  status: PhaseStatus;
  completedAt?: string;
  summary?: string;
  items?: { label: string; detail: string }[];
}

interface WorkflowStatusPanelProps {
  phases: PhaseInfo[];
  onViewPhaseDetail: (phaseKey: string) => void;
}

export default function WorkflowStatusPanel({
  phases,
  onViewPhaseDetail,
}: WorkflowStatusPanelProps) {
  const { tokens } = useTheme();

  const completedCount = phases.filter((p) => p.status === "complete").length;
  const totalCount = phases.length;
  const progressPercent = (completedCount / totalCount) * 100;

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
        <Typography variant="subtitle1" fontWeight={600}>
          Workflow Status
        </Typography>
      </Box>

      {/* Scrollable body — subtle bg with white cards */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          backgroundColor: tokens.semantic.color.surface.subtle.value,
        }}
      >
        <Stack spacing={1.5}>
          {/* Overview card */}
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
                alignItems="flex-start"
                justifyContent="space-between"
                sx={{ px: 0.5 }}
              >
                {phases.map((phase, i) => (
                  <PhaseStepperNode
                    key={phase.key}
                    label={phase.label}
                    status={phase.status}
                    isLast={i === phases.length - 1}
                  />
                ))}
              </Stack>

              <LinearProgress
                variant="determinate"
                value={progressPercent}
                color={completedCount === totalCount ? "success" : "warning"}
                sx={{ borderRadius: 1, height: 5 }}
              />
              <Typography
                variant="caption"
                sx={{ color: tokens.semantic.color.type.muted.value }}
              >
                {completedCount} of {totalCount} workflow phases complete
              </Typography>
            </Stack>
          </Paper>

          {/* Phase cards */}
          {phases.map((phase) => (
            <Paper
              key={phase.key}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: tokens.semantic.radius.md.value,
                backgroundColor: tokens.semantic.color.surface.default.value,
                border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              }}
            >
              <Stack spacing={1}>
                {/* Title row */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="textSm" fontWeight={600}>
                    {phase.label}
                  </Typography>
                  <StatusChip status={phase.status} />
                </Stack>

                {/* Summary */}
                {phase.summary && (
                  <Typography
                    variant="caption"
                    sx={{ color: tokens.semantic.color.type.muted.value }}
                  >
                    {phase.summary}
                  </Typography>
                )}

                {/* Key-value items */}
                {phase.items && phase.items.length > 0 && (
                  <Stack spacing={0.25}>
                    {phase.items.map((item) => (
                      <Stack key={item.label} direction="row" spacing={2}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: tokens.semantic.color.type.muted.value,
                            minWidth: 100,
                            flexShrink: 0,
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                          {item.detail}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}

                {/* Timestamp */}
                {phase.completedAt && (
                  <Typography
                    variant="caption"
                    sx={{ color: tokens.semantic.color.type.muted.value }}
                  >
                    Completed {phase.completedAt}
                  </Typography>
                )}

                {/* View details link */}
                {phase.status !== "not-started" && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onViewPhaseDetail(phase.key)}
                    sx={{ alignSelf: "flex-start", mt: 0.5 }}
                  >
                    View details
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

function StatusChip({ status }: { status: PhaseStatus }) {
  if (status === "complete")
    return (
      <StatusIndicator
        icon={<CheckedCircleIcon />}
        label="Complete"
        size="small"
        color="success"
      />
    );
  if (status === "in-progress")
    return <StatusIndicator label="In progress" size="small" color="warning" />;
  return <StatusIndicator label="Not started" size="small" color="subtle" />;
}

function PhaseStepperNode({
  label,
  status,
  isLast,
}: {
  label: string;
  status: PhaseStatus;
  isLast: boolean;
}) {
  const { tokens } = useTheme();

  const bg =
    status === "complete"
      ? tokens.semantic.color.status.success.text.value
      : status === "in-progress"
        ? tokens.semantic.color.status.warning.text.value
        : tokens.semantic.color.surface.variant.value;

  const iconColor =
    status === "complete" || status === "in-progress"
      ? tokens.semantic.color.surface.default.value
      : tokens.semantic.color.type.muted.value;

  return (
    <Stack
      alignItems="center"
      spacing={0.5}
      sx={{ flex: isLast ? "0 0 auto" : 1, position: "relative" }}
    >
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: "calc(50% + 12px)",
            right: "-50%",
            height: 2,
            backgroundColor:
              status === "complete"
                ? tokens.semantic.color.status.success.text.value
                : tokens.semantic.color.outline.fixed.value,
            zIndex: 0,
          }}
        />
      )}
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          zIndex: 1,
          position: "relative",
        }}
      >
        {status === "complete" ? (
          <CheckedCircleIcon style={{ fontSize: 14 }} />
        ) : status === "in-progress" ? (
          <ClockIcon style={{ fontSize: 12 }} />
        ) : (
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: iconColor,
            }}
          />
        )}
      </Box>
      <Typography
        variant="caption"
        fontWeight={status !== "not-started" ? 600 : 400}
        sx={{
          color:
            status !== "not-started"
              ? tokens.semantic.color.type.default.value
              : tokens.semantic.color.type.muted.value,
          textAlign: "center",
          fontSize: "0.6rem",
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
