import { Box, useTheme } from "@mui/material";
import { Outlet, Route, Routes } from "react-router";
import "./styles.css";

import GlobalHeader from "./components/GlobalHeader.js";
import CommandCenterPage from "./pages/CommandCenterPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import IncidentInvestigationPage from "./pages/IncidentInvestigationPage.js";

function CenteredLayout() {
  const { tokens } = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: tokens.semantic.gradients.background.default.value,
      }}
    >
      <GlobalHeader />
      <Box
        component="main"
        sx={{ maxWidth: 1080, mx: "auto", px: 3, py: 3 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CenteredLayout />}>
        <Route index element={<CommandCenterPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/investigate/:incidentId" element={<IncidentInvestigationPage />} />
    </Routes>
  );
}
