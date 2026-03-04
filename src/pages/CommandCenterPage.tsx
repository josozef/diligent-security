import { Stack, Typography, useTheme } from "@mui/material";
import RiskIcon from "@diligentcorp/atlas-react-bundle/icons/Risk";

import PageLayout from "../components/PageLayout.js";
import HeroBanner from "../components/HeroBanner.js";
import QuickActions from "../components/QuickActions.js";
import PendingVulnerabilities from "../components/PendingVulnerabilities.js";
import RecentActivity from "../components/RecentActivity.js";
import ProactiveTasks from "../components/ProactiveTasks.js";
import SystemLog from "../components/SystemLog.js";

export default function CommandCenterPage() {
  const { tokens } = useTheme();

  return (
    <PageLayout>
      <Stack direction="row" alignItems="center" spacing={1}>
        <RiskIcon
          style={{ color: tokens.semantic.color.type.muted.value }}
        />
        <Typography variant="h6" fontWeight={600}>
          IT Risk Command Center
        </Typography>
      </Stack>

      <HeroBanner />
      <QuickActions />
      <PendingVulnerabilities />
      <RecentActivity />
      <ProactiveTasks />
      <SystemLog />
    </PageLayout>
  );
}
