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
    <PageLayout gap={5}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          component="img"
          src="/diligent-d.svg"
          alt=""
          sx={{ height: 20, width: "auto", display: "block", flexShrink: 0 }}
        />
        <Typography variant="subtitle1" fontWeight={600} component="h1">
          IT Risk Command Center
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <HeroBanner hasAlerts={hasAlerts} />
        <QuickActions />
        {hasAlerts && <PendingVulnerabilities />}
      </Stack>

      <RecentActivity />
      <ProactiveTasks />
      <SystemLog hasAlerts={hasAlerts} />
    </PageLayout>
  );
}
