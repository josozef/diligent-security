import {
  Box,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { Outlet, Route, Routes } from "react-router";
import "./styles.css";

import { useDemo, type ThemeMode } from "./DemoContext";
import GlobalHeader from "./components/GlobalHeader.js";
import CommandCenterPage from "./pages/CommandCenterPage.js";
import SettingsPage from "./pages/SettingsPage.js";
import IncidentInvestigationPage from "./pages/IncidentInvestigationPage.js";

function DemoToggleBar() {
  const { tokens } = useTheme();
  const { hasAlerts, setHasAlerts, themeMode, setThemeMode } = useDemo();

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 11,
        backgroundColor: tokens.semantic.color.surface.variant.value,
        borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
        px: 3,
        py: 0.75,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" fontWeight={600} sx={{ color: tokens.semantic.color.type.muted.value }}>
            Scenario
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={hasAlerts ? "alerts" : "clear"}
            onChange={(_, val) => {
              if (val) setHasAlerts(val === "alerts");
            }}
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                px: 1.5,
                py: 0.25,
                fontSize: "0.75rem",
                fontWeight: 600,
              },
            }}
          >
            <ToggleButton value="alerts">
              <Chip
                label="Active alerts"
                size="small"
                color={hasAlerts ? "error" : "default"}
                variant={hasAlerts ? "filled" : "outlined"}
                sx={{ pointerEvents: "none", height: 22, fontSize: "0.7rem" }}
              />
            </ToggleButton>
            <ToggleButton value="clear">
              <Chip
                label="All clear"
                size="small"
                color={!hasAlerts ? "success" : "default"}
                variant={!hasAlerts ? "filled" : "outlined"}
                sx={{ pointerEvents: "none", height: 22, fontSize: "0.7rem" }}
              />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" fontWeight={600} sx={{ color: tokens.semantic.color.type.muted.value }}>
            Theme
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={themeMode}
            onChange={(_, val) => {
              if (val) setThemeMode(val as ThemeMode);
            }}
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                px: 1.5,
                py: 0.25,
                fontSize: "0.75rem",
                fontWeight: 600,
              },
            }}
          >
            <ToggleButton value="atlas-light">Light</ToggleButton>
            <ToggleButton value="atlas-dark">Dark</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
}

function CenteredLayout() {
  const { tokens } = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: tokens.semantic.gradients.background.default.value,
      }}
    >
      <DemoToggleBar />
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
