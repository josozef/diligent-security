import { Box, Stack, Typography } from "@mui/material";

import { useDemo } from "../DemoContext";
import PageLayout from "../components/PageLayout.js";
import HeroBanner from "../components/HeroBanner.js";
import QuickActions from "../components/QuickActions.js";
import PendingVulnerabilities from "../components/PendingVulnerabilities.js";
import RecentActivity from "../components/RecentActivity.js";
import ProactiveTasks from "../components/ProactiveTasks.js";
import SystemLog from "../components/SystemLog.js";

export default function CommandCenterPage() {
  const { hasAlerts } = useDemo();

  return (
    <PageLayout>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1,
            background: "linear-gradient(135deg, #e4572e 0%, #c9302c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 800,
              lineHeight: 1,
              fontFamily: "inherit",
            }}
          >
            D
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={600}>
          IT Risk Command Center
        </Typography>
      </Stack>

      <HeroBanner hasAlerts={hasAlerts} />
      <QuickActions />
      {hasAlerts && <PendingVulnerabilities />}
      <RecentActivity />
      <ProactiveTasks />
      <SystemLog hasAlerts={hasAlerts} />
    </PageLayout>
  );
}
