import { Box, Link, Stack, Typography, useTheme } from "@mui/material";
import {
  OPERATIONAL_TRENDS_SUBTITLE,
  OPERATIONAL_TRENDS_TITLE,
  OperationalMonitoringCharts,
} from "./OperationalTrends.js";

interface Task {
  title: string;
  description: string;
}

const tasks: Task[] = [
  {
    title: "Complete Q1 Risk Assessment",
    description:
      "Review asset inventory, threat landscape, and control effectiveness for the quarter. When you're ready, capture decisions and export a summary leadership can act on.",
  },
  {
    title: "Annual Vendor Security Reviews",
    description:
      "Gather certifications, compare contract SLAs, and refresh tier ratings for critical vendors. We'll highlight missing artifacts and overdue follow-ups so you know where to start.",
  },
  {
    title: "Disaster Recovery Plan Update",
    description:
      "Fold in recent infrastructure and dependency changes across runbooks, RTO/RPO targets, failover steps, and stakeholder communications so drills match how you operate today.",
  },
  {
    title: "NIS2 Gap Analysis",
    description:
      "Map regulatory obligations to your controls, evidence, and reporting workflows. See what's already covered, what needs an owner, and what to prioritize before deadlines tighten.",
  },
];

const subtleLink = {
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 500,
};

/** Keeps both column subtitles the same block height so row 3 tops align across the grid. */
const SUBTITLE_MIN_HEIGHT_MD = "2.75rem";

export default function ProactiveTasks() {
  const { tokens } = useTheme();
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.default.value;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        columnGap: { xs: 4, md: 5 },
        rowGap: 0,
        alignItems: "start",
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={600}
        sx={{
          letterSpacing: "0.01em",
          gridColumn: { xs: 1, md: 1 },
          gridRow: { xs: 1, md: 1 },
          mb: 0.375,
        }}
      >
        Proactive Tasks
      </Typography>

      <Typography
        variant="subtitle2"
        fontWeight={600}
        sx={{
          letterSpacing: "0.01em",
          gridColumn: { xs: 1, md: 2 },
          gridRow: { xs: 4, md: 1 },
          mb: 0.375,
        }}
      >
        {OPERATIONAL_TRENDS_TITLE}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: muted,
          lineHeight: 1.4,
          gridColumn: { xs: 1, md: 1 },
          gridRow: { xs: 2, md: 2 },
          minHeight: { md: SUBTITLE_MIN_HEIGHT_MD },
          alignSelf: "start",
        }}
      >
        Optional work you can start when you&apos;re ready—nothing here is in progress.
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: muted,
          lineHeight: 1.4,
          gridColumn: { xs: 1, md: 2 },
          gridRow: { xs: 5, md: 2 },
          minHeight: { md: SUBTITLE_MIN_HEIGHT_MD },
          alignSelf: "start",
        }}
      >
        {OPERATIONAL_TRENDS_SUBTITLE}
      </Typography>

      <Stack
        component="ul"
        spacing={0}
        sx={{
          m: 0,
          p: 0,
          listStyle: "none",
          gridColumn: { xs: 1, md: 1 },
          gridRow: { xs: 3, md: 3 },
          mt: { xs: 2, md: 0 },
        }}
      >
        {tasks.map((task, i) => (
          <Box
            key={task.title}
            component="li"
            sx={{
              borderTop: i > 0 ? `1px solid ${outline}` : "none",
              ...(i === 0
                ? { pt: { xs: 1, md: 0 }, pb: 1.75 }
                : { py: 1.75 }),
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: "0.8125rem", lineHeight: 1.35 }}>
                {task.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: muted,
                  lineHeight: 1.45,
                  display: "block",
                  fontSize: "0.8125rem",
                }}
              >
                {task.description}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ pt: 0.5 }}>
                <Link component="button" type="button" underline="hover" sx={subtleLink}>
                  Learn more
                </Link>
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  sx={{ ...subtleLink, color: muted, fontWeight: 400 }}
                >
                  Not now
                </Link>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Box
        sx={{
          gridColumn: { xs: 1, md: 2 },
          gridRow: { xs: 6, md: 3 },
          mt: { xs: 3, md: 0 },
          minWidth: 0,
        }}
      >
        <OperationalMonitoringCharts />
      </Box>
    </Box>
  );
}
