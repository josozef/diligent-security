import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

interface Task {
  title: string;
  description: string;
  app: string;
}

interface Feature {
  title: string;
  description: string;
}

const tasks: Task[] = [
  {
    title: "Complete Q1 IT risk assessment",
    description:
      "Annual risk assessment due in 14 days. Review updated asset inventory and threat landscape.",
    app: "Risk Manager",
  },
  {
    title: "Review vendor security certifications",
    description:
      "3 vendor SOC 2 reports received. Verify compliance and update vendor risk profiles.",
    app: "Vendor Risk",
  },
  {
    title: "Update disaster recovery plan",
    description:
      "DR plan last updated 90 days ago. New cloud infrastructure changes require review.",
    app: "Risk Manager",
  },
  {
    title: "Run NIS2 compliance gap analysis",
    description:
      "NIS2 enforcement approaching. Identify gaps in current security controls and reporting.",
    app: "Frameworks",
  },
];

const features: Feature[] = [
  {
    title: "AI vulnerability prioritization",
    description:
      "Automatically rank vulnerabilities by business impact using AI-driven analysis.",
  },
  {
    title: "Enhanced compliance dashboard",
    description:
      "Real-time compliance posture across all frameworks in a single view.",
  },
  {
    title: "Automated vendor monitoring",
    description:
      "Continuous monitoring of vendor security posture with real-time alerts.",
  },
];

export default function ProactiveTasks() {
  const { tokens } = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "7fr 5fr",
        gap: 3,
        alignItems: "start",
      }}
    >
      {/* Left: proactive tasks */}
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Since everything's under control, get ahead of a few things
        </Typography>

        <Stack spacing={0}>
          {tasks.map((task, i) => (
            <Box key={task.title}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 2 }}
              >
                <Stack spacing={0.5} flex={1} sx={{ mr: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {task.title}
                  </Typography>
                  <Typography
                    variant="textSm"
                    sx={{
                      color: tokens.semantic.color.type.muted.value,
                    }}
                  >
                    {task.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={task.app}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: tokens.semantic.color.type.muted.value,
                      }}
                    >
                      Ready to complete
                    </Typography>
                  </Stack>
                </Stack>
                <Button variant="outlined" size="small" sx={{ flexShrink: 0 }}>
                  Open in app
                </Button>
              </Stack>
              {i < tasks.length - 1 && <Divider />}
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* Right: what's new */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${tokens.semantic.color.outline.default.value}`,
          borderRadius: tokens.semantic.radius.lg.value,
          backgroundColor: tokens.semantic.color.surface.variant.value,
        }}
      >
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography
              variant="overline"
              sx={{
                color: tokens.semantic.color.type.muted.value,
                letterSpacing: 1.5,
                fontSize: "0.65rem",
              }}
            >
              What's new
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              Good to know and good to go
            </Typography>
            <Typography
              variant="textSm"
              sx={{ color: tokens.semantic.color.type.muted.value }}
            >
              Learn more about features and capabilities you already have today.
            </Typography>
          </Stack>

          <Divider />

          {features.map((feature, i) => (
            <Box key={feature.title}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="textSm"
                  sx={{
                    color: tokens.semantic.color.type.muted.value,
                  }}
                >
                  {feature.description}
                </Typography>
                <Link
                  component="button"
                  variant="caption"
                  underline="hover"
                  sx={{ fontWeight: 700, alignSelf: "flex-start" }}
                >
                  OPEN
                </Link>
              </Stack>
              {i < features.length - 1 && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
