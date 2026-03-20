import { Box, useTheme } from "@mui/material";
import { Outlet, Route, Routes } from "react-router";
import "./styles.css";

import DemoControlsFab from "./components/DemoControlsFab.js";
import GlobalHeader from "./components/GlobalHeader.js";
import CommandCenterPage from "./pages/CommandCenterPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import IncidentInvestigationPage from "./pages/IncidentInvestigationPage.js";

/** Shared shell: app header on every route. Demo controls FAB only on centered routes. */
function RootLayout() {
  const { tokens } = useTheme();
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: tokens.semantic.gradients.background.default.value,
      }}
    >
      <GlobalHeader />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

/** Constrained width for command center and settings; prototype FAB does not appear on incident routes. */
function CenteredMain() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: 980,
          width: "100%",
          mx: "auto",
          px: 3,
          py: 3,
          minHeight: 0,
        }}
      >
        <Outlet />
      </Box>
      <DemoControlsFab />
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<CenteredMain />}>
          <Route index element={<CommandCenterPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="investigate/:incidentId" element={<IncidentInvestigationPage />} />
      </Route>
    </Routes>
  );
}
