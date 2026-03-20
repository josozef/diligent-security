import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import QuestionIcon from "@diligentcorp/atlas-react-bundle/icons/Question";
import SettingsIcon from "@diligentcorp/atlas-react-bundle/icons/Settings";
import AppSwitcherIcon from "@diligentcorp/atlas-react-bundle/icons/AppSwitcher";
import ProfileIcon from "@diligentcorp/atlas-react-bundle/icons/Profile";

export default function GlobalHeader() {
  const { tokens } = useTheme();
  const [appMenuAnchor, setAppMenuAnchor] = useState<null | HTMLElement>(null);

  const fg = tokens.semantic.color.type.default.value;
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.default.value;
  const surfaceVariant = tokens.semantic.color.surface.variant.value;
  const surfaceSubtle = tokens.semantic.color.surface.subtle.value;
  const radiusMd = tokens.semantic.radius.md.value;

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
        sx={{ px: 3, py: 1.25, gap: 2, minHeight: 52 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Box
            component={Link}
            to="/"
            aria-label="Home"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,
              textDecoration: "none",
              color: "inherit",
              borderRadius: 1,
              outlineOffset: 2,
              "&:focus-visible": {
                outline: `2px solid ${tokens.semantic.color.action.primary.default.value}`,
              },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                borderRadius: radiusMd,
                p: 0.5,
                backgroundColor: surfaceSubtle,
                border: `1px solid ${outline}`,
                boxShadow: (t) => t.shadows[1],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/acme-mark.svg"
                alt=""
                sx={{ height: 32, width: 32, display: "block" }}
              />
            </Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{
                color: fg,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Acme Co, Inc.
            </Typography>
          </Box>

          <IconButton
            size="small"
            aria-label="App launcher"
            aria-haspopup="true"
            aria-expanded={Boolean(appMenuAnchor)}
            onClick={(e) => setAppMenuAnchor(e.currentTarget)}
            sx={{ color: fg, flexShrink: 0 }}
          >
            <AppSwitcherIcon />
          </IconButton>
          <Menu
            anchorEl={appMenuAnchor}
            open={Boolean(appMenuAnchor)}
            onClose={() => setAppMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MenuItem disabled sx={{ justifyContent: "space-between", gap: 2, opacity: 1 }}>
              <span>Security</span>
              <Typography variant="caption" sx={{ color: muted }}>
                Current
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => setAppMenuAnchor(null)}>Board &amp; leadership</MenuItem>
            <MenuItem onClick={() => setAppMenuAnchor(null)}>Compliance</MenuItem>
            <MenuItem onClick={() => setAppMenuAnchor(null)}>Entities</MenuItem>
          </Menu>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              borderRadius: radiusMd,
              backgroundColor: surfaceVariant,
              border: `1px solid ${outline}`,
            }}
          >
            <IconButton size="small" aria-label="Help" sx={{ color: fg }}>
              <QuestionIcon />
            </IconButton>
          </Box>

          <IconButton size="small" aria-label="Settings" component={Link} to="/settings" sx={{ color: fg }}>
            <SettingsIcon />
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.75, my: 0.5, borderColor: outline }} />

          <IconButton size="small" aria-label="Profile" sx={{ color: fg }}>
            <ProfileIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: tokens.semantic.color.outline.fixed.value }} />
    </Box>
  );
}
