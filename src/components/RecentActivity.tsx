import { Box, Chip, Paper, Stack, Typography, useTheme } from "@mui/material";

interface Activity {
  app: string;
  date: string;
  description: string;
}

const activities: Activity[] = [
  {
    app: "Vulnerability management",
    date: "Mar 3",
    description:
      "Completed weekly vulnerability scan for production environment. 3 new findings identified.",
  },
  {
    app: "Risk register",
    date: "Mar 3",
    description:
      "Updated risk assessment for cloud infrastructure migration. Residual risk reduced to moderate.",
  },
  {
    app: "Compliance",
    date: "Mar 2",
    description:
      "Reviewed NIST CSF alignment report and updated 12 control mappings for Q1 audit readiness.",
  },
  {
    app: "Vendor risk",
    date: "Mar 2",
    description:
      "Completed annual security review for 5 critical tier-1 vendors. All certifications current.",
  },
];

export default function RecentActivity() {
  const { tokens } = useTheme();

  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.25}>
        <Typography variant="h6" fontWeight={600}>
          Recent activity
        </Typography>
        <Typography
          variant="textSm"
          sx={{ color: tokens.semantic.color.type.muted.value }}
        >
          Latest updates from connected applications.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
        }}
      >
        {activities.map((activity) => (
          <Paper
            key={activity.app}
            elevation={0}
            sx={{
              p: 2.5,
              border: `1px solid ${tokens.semantic.color.outline.default.value}`,
              borderRadius: tokens.semantic.radius.lg.value,
              cursor: "pointer",
              transition: "background-color 0.15s",
              "&:hover": {
                backgroundColor: tokens.semantic.color.surface.variant.value,
              },
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {activity.app}
                </Typography>
                <Chip
                  label={activity.date}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              </Stack>
              <Typography
                variant="textSm"
                sx={{ color: tokens.semantic.color.type.muted.value }}
              >
                {activity.description}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Stack>
  );
}
