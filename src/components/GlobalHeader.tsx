import { Avatar, Box, Divider, IconButton, Stack, Typography, useTheme } from "@mui/material";
import QuestionIcon from "@diligentcorp/atlas-react-bundle/icons/Question";
import SettingsIcon from "@diligentcorp/atlas-react-bundle/icons/Settings";
import AppSwitcherIcon from "@diligentcorp/atlas-react-bundle/icons/AppSwitcher";
import ProfileIcon from "@diligentcorp/atlas-react-bundle/icons/Profile";

export default function GlobalHeader() {
  const { tokens } = useTheme();

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: tokens.semantic.color.surface.default.value,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, py: 1.25 }}
      >
        {/* Left: Diligent brand logo (includes wordmark) */}
        <Box
          component="img"
          src="/diligent-logo.png"
          alt="Diligent"
          sx={{ height: 22 }}
        />

        {/* Right: actions + org switcher */}
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <IconButton
            size="small"
            sx={{ color: tokens.semantic.color.type.muted.value }}
          >
            <QuestionIcon />
          </IconButton>

          <IconButton
            size="small"
            sx={{ color: tokens.semantic.color.type.muted.value }}
          >
            <SettingsIcon />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.75, my: 0.5 }}
          />

          <IconButton
            size="small"
            sx={{
              backgroundColor: tokens.semantic.color.action.primary.default.value,
              color: tokens.semantic.color.action.primary.onPrimary.value,
              borderRadius: 1.5,
              width: 32,
              height: 32,
              "&:hover": { backgroundColor: tokens.semantic.color.action.primary.hover.value },
            }}
          >
            <AppSwitcherIcon />
          </IconButton>

          {/* Org switcher pill */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              border: `1px solid ${tokens.semantic.color.outline.default.value}`,
              borderRadius: 99,
              pl: 0.75,
              pr: 0.5,
              py: 0.5,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: tokens.semantic.color.surface.variant.value,
              },
            }}
          >
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "0.55rem",
                fontWeight: 700,
                bgcolor: tokens.semantic.color.dataVisualization.qualitative.blue["04"].value,
              }}
            >
              Pf
            </Avatar>
            <Typography variant="caption" fontWeight={600} sx={{ userSelect: "none" }}>
              Pfizer Compliance
            </Typography>
            <Avatar
              sx={{
                width: 26,
                height: 26,
                bgcolor: tokens.semantic.color.surface.variant.value,
                color: tokens.semantic.color.type.muted.value,
              }}
            >
              <ProfileIcon />
            </Avatar>
          </Stack>
        </Stack>
      </Stack>

      {/* Diligent spectrum stripe — fixed brand identity gradient */}
      <Box
        sx={{
          height: 3,
          background: `linear-gradient(90deg, ${tokens.core.color.brand.primary.diligentRed.value} 0%, ${tokens.core.color.orange[50].value} 15%, ${tokens.core.color.orange[60].value} 28%, ${tokens.core.color.yellow[80].value} 40%, ${tokens.core.color.green[70].value} 52%, ${tokens.core.color.blue[60].value} 65%, ${tokens.core.color.blue[50].value} 78%, ${tokens.core.color.indigo[40].value} 90%, ${tokens.core.color.purple[30].value} 100%)`,
        }}
      />
    </Box>
  );
}
