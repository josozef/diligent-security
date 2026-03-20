import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import FrameworksIcon from "@diligentcorp/atlas-react-bundle/icons/Frameworks";
import ThirdPartyIcon from "@diligentcorp/atlas-react-bundle/icons/ThirdParty";
import VirusFoundIcon from "@diligentcorp/atlas-react-bundle/icons/VirusFound";

interface Activity {
  Icon: typeof VirusFoundIcon;
  title: string;
  description: string;
  timestamp: string;
}

const activities: Activity[] = [
  {
    Icon: VirusFoundIcon,
    title: "Vulnerability Management",
    description: "12 new vulnerabilities detected in Q1 scan",
    timestamp: "2 hours ago",
  },
  {
    Icon: DocumentIcon,
    title: "Risk Register",
    description: "Risk appetite statement updated for FY2026",
    timestamp: "5 hours ago",
  },
  {
    Icon: FrameworksIcon,
    title: "Compliance Monitoring",
    description: "SOC 2 Type II audit evidence collection at 87%",
    timestamp: "1 day ago",
  },
  {
    Icon: ThirdPartyIcon,
    title: "Vendor Risk",
    description: "3 vendors flagged for SLA non-compliance",
    timestamp: "2 days ago",
  },
];

export default function RecentActivity() {
  const { tokens } = useTheme();
  const outline = tokens.semantic.color.outline.default.value;
  const outlineHover = tokens.semantic.color.outline.hover.value;
  const muted = tokens.semantic.color.type.muted.value;

  return (
    <Stack spacing={1.25}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ letterSpacing: "0.01em" }}>
        Recent Activity
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {activities.map((activity) => (
          <Paper
            key={activity.title}
            component="button"
            type="button"
            elevation={0}
            sx={{
              p: 2.5,
              border: `1px solid ${outline}`,
              borderRadius: tokens.semantic.radius.lg.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              font: "inherit",
              color: "inherit",
              transition: (t) =>
                t.transitions.create(["box-shadow", "border-color", "transform", "background-color"], {
                  duration: t.transitions.duration.shorter,
                }),
              "&:hover": {
                borderColor: outlineHover,
                backgroundColor: tokens.semantic.color.surface.variant.value,
                boxShadow: (t) => t.shadows[4],
                transform: "translateY(-2px)",
              },
              "&:focus-visible": {
                outline: `2px solid ${tokens.semantic.color.action.primary.default.value}`,
                outlineOffset: 2,
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: (t) => t.shadows[2],
              },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <activity.Icon
                style={{
                  fontSize: 20,
                  flexShrink: 0,
                  marginTop: 2,
                  color: muted,
                }}
              />
              <Stack spacing={0.5} flex={1} minWidth={0}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {activity.title}
                </Typography>
                <Typography variant="textSm" sx={{ color: muted }}>
                  {activity.description}
                </Typography>
                <Typography variant="caption" sx={{ color: muted, opacity: 0.85 }}>
                  {activity.timestamp}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Stack>
  );
}
