import { useRef, useState } from "react";
import {
  Box,
  Fab,
  IconButton,
  Paper,
  Popover,
  Portal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import LightbulbIcon from "@diligentcorp/atlas-react-bundle/icons/Lightbulb";
import { useDemo } from "../DemoContext";

function SwatchRow({ colors }: { colors: string[] }) {
  const { tokens } = useTheme();
  const outline = tokens.semantic.color.outline.fixed.value;
  return (
    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
      {colors.map((c, i) => (
        <Box
          key={`${c}-${i}`}
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: c,
            border: `1px solid ${outline}`,
          }}
        />
      ))}
    </Stack>
  );
}

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  swatches: string[];
  title: string;
  description: string;
}

function SelectableCard({ selected, onClick, swatches, title, description }: SelectableCardProps) {
  const { tokens } = useTheme();
  const accent = tokens.semantic.color.status.error.default.value;
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        p: 1.5,
        borderRadius: tokens.semantic.radius.md.value,
        cursor: "pointer",
        border: `2px solid ${selected ? accent : tokens.semantic.color.outline.fixed.value}`,
        backgroundColor: tokens.semantic.color.surface.default.value,
        transition: (t) => t.transitions.create(["border-color", "box-shadow"], { duration: t.transitions.duration.shorter }),
        "&:hover": {
          borderColor: selected ? accent : tokens.semantic.color.outline.hover.value,
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <SwatchRow colors={swatches} />
        <Stack spacing={0.25} flex={1} minWidth={0}>
          <Typography variant="textSm" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, lineHeight: 1.35 }}>
            {description}
          </Typography>
        </Stack>
        {selected ? (
          <CheckedCircleIcon
            style={{
              fontSize: 22,
              flexShrink: 0,
              color: accent,
            }}
          />
        ) : (
          <Box sx={{ width: 22, flexShrink: 0 }} />
        )}
      </Stack>
    </Paper>
  );
}

export default function DemoControlsFab() {
  const { tokens } = useTheme();
  const { hasAlerts, setHasAlerts, themeMode, setThemeMode } = useDemo();
  const fabRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const error = tokens.semantic.color.status.error.default.value;
  const success = tokens.semantic.color.status.success.default.value;
  const successBg = tokens.semantic.color.status.success.background.value;
  const surface = tokens.semantic.color.surface.default.value;
  const subtle = tokens.semantic.color.surface.subtle.value;
  const typeDefault = tokens.semantic.color.type.default.value;
  const blue = tokens.semantic.color.dataVisualization.qualitative.blue["04"].value;
  const mutedLine = tokens.semantic.color.outline.fixed.value;

  return (
    <Portal>
      <>
        <Fab
          ref={fabRef}
          color="primary"
          aria-label="Open demo settings: scenario and theme"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: (t) => t.zIndex.modal + 2,
            boxShadow: (t) => t.shadows[6],
            border: `2px solid ${blue}`,
            backgroundColor: error,
            color: tokens.semantic.color.action.primary.onPrimary.value,
            "&:hover": {
              backgroundColor: error,
              opacity: 0.92,
            },
          }}
        >
          <LightbulbIcon style={{ fontSize: 26 }} />
        </Fab>

        <Popover
          open={open}
          anchorEl={fabRef.current}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ zIndex: (t) => t.zIndex.modal + 3 }}
          slotProps={{
            paper: {
              elevation: 8,
              sx: {
                width: 320,
                maxWidth: "calc(100vw - 32px)",
                borderRadius: tokens.semantic.radius.lg.value,
                overflow: "hidden",
                border: `1px solid ${mutedLine}`,
              },
            },
          }}
        >
        <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              letterSpacing="0.08em"
              sx={{ color: tokens.semantic.color.type.muted.value }}
            >
              Demo settings
            </Typography>
            <IconButton
              size="small"
              aria-label="Close demo settings"
              onClick={() => setOpen(false)}
              sx={{ color: tokens.semantic.color.type.muted.value }}
            >
              <CloseIcon style={{ fontSize: 18 }} />
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="caption" fontWeight={600} sx={{ color: tokens.semantic.color.type.muted.value }}>
                Scenario
              </Typography>
              <Stack spacing={1}>
                <SelectableCard
                  selected={hasAlerts}
                  onClick={() => setHasAlerts(true)}
                  swatches={[typeDefault, subtle, error]}
                  title="Active alerts"
                  description="Command center shows critical items and action-required state."
                />
                <SelectableCard
                  selected={!hasAlerts}
                  onClick={() => setHasAlerts(false)}
                  swatches={[surface, successBg, success]}
                  title="All clear"
                  description="Positive posture banner and no open alert queue."
                />
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="caption" fontWeight={600} sx={{ color: tokens.semantic.color.type.muted.value }}>
                Theme
              </Typography>
              <Stack spacing={1}>
                <SelectableCard
                  selected={themeMode === "atlas-light"}
                  onClick={() => setThemeMode("atlas-light")}
                  swatches={[surface, surface, blue]}
                  title="Light"
                  description="Atlas light — bright surfaces and high contrast type."
                />
                <SelectableCard
                  selected={themeMode === "atlas-dark"}
                  onClick={() => setThemeMode("atlas-dark")}
                  swatches={["#0a0a0c", "#1c1c22", blue]}
                  title="Dark"
                  description="Atlas dark — reduced glare for extended review."
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Popover>
      </>
    </Portal>
  );
}
