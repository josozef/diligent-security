import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";

interface StepPreviewPanelProps {
  title: string;
  description: string;
  summary?: string;
  ctaLabel: string;
  onCtaClick: () => void;
  completed?: boolean;
  completedAt?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

export default function StepPreviewPanel({
  title,
  description,
  summary,
  ctaLabel,
  onCtaClick,
  completed,
  completedAt,
  onBack,
  children,
}: StepPreviewPanelProps) {
  const { tokens } = useTheme();

  return (
    <Stack spacing={0} sx={{ height: "100%" }}>
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          backgroundColor: tokens.semantic.color.surface.default.value,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {onBack && (
              <IconButton size="small" onClick={onBack}>
                <ArrowLeftIcon />
              </IconButton>
            )}
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
          </Stack>
          {completed && (
            <StatusIndicator
              icon={<CheckedCircleIcon />}
              label={completedAt ? `Complete ${completedAt}` : "Complete"}
              size="small"
              color="success"
            />
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          backgroundColor: tokens.semantic.color.surface.subtle.value,
        }}
      >
        <Stack spacing={1.5}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            }}
          >
            <Stack spacing={1}>
              <Typography variant="textSm">{description}</Typography>
              {summary && (
                <Typography
                  variant="caption"
                  sx={{ color: tokens.semantic.color.type.muted.value }}
                >
                  {summary}
                </Typography>
              )}
              {children}
            </Stack>
          </Paper>

          {!completed && (
            <Button
              variant="contained"
              fullWidth
              size="medium"
              onClick={onCtaClick}
            >
              {ctaLabel}
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
