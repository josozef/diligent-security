import {
  Box,
  ButtonBase,
  Chip,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import AutomatedIcon from "@diligentcorp/atlas-react-bundle/icons/Automated";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import ReportsIcon from "@diligentcorp/atlas-react-bundle/icons/Reports";
import AiSearchIcon from "@diligentcorp/atlas-react-bundle/icons/AiSearch";
import IssueTrackerIcon from "@diligentcorp/atlas-react-bundle/icons/IssueTracker";
import FrameworksIcon from "@diligentcorp/atlas-react-bundle/icons/Frameworks";
import SendIcon from "@diligentcorp/atlas-react-bundle/icons/Send";

const actions = [
  {
    icon: <AutomatedIcon />,
    label: "Start response workflow",
    subtitle: "Triage incidents end to end",
  },
  {
    icon: <DocumentIcon />,
    label: "Draft security briefing",
    subtitle: "Board and executive summaries",
  },
  {
    icon: <ReportsIcon />,
    label: "Run exposure report",
    subtitle: "CVE trends and heat maps",
  },
  {
    icon: <AiSearchIcon />,
    label: "Search intelligence",
    subtitle: "Policies, assets, and logs",
  },
  {
    icon: <IssueTrackerIcon />,
    label: "Open remediation ticket",
    subtitle: "Track patches and owners",
  },
  {
    icon: <FrameworksIcon />,
    label: "Review compliance scope",
    subtitle: "Controls and attestations",
  },
];

export default function QuickActions() {
  const { tokens } = useTheme();
  const warn = tokens.semantic.color.status.warning.default.value;
  const warnText = tokens.semantic.color.status.warning.text.value;

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${tokens.semantic.color.outline.default.value}`,
        borderRadius: tokens.semantic.radius.lg.value,
        p: 3,
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600}>
              What do you need to do?
            </Typography>
            <Typography
              variant="textSm"
              sx={({ tokens: t }) => ({
                color: t.semantic.color.type.muted.value,
                maxWidth: 520,
              })}
            >
              Ask questions or choose an action below. Work entirely within
              Diligent.
            </Typography>
          </Stack>
          <Chip
            size="small"
            variant="outlined"
            label="Demo"
            icon={
              <Box
                component="span"
                sx={{
                  ml: 0.5,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: warn,
                }}
              />
            }
            sx={{
              borderColor: warn,
              color: warnText,
              fontWeight: 600,
              flexShrink: 0,
            }}
          />
        </Stack>

        <OutlinedInput
          fullWidth
          placeholder="Ask a question or describe what you need..."
          endAdornment={
            <InputAdornment position="end" sx={{ ml: 0.5 }}>
              <ButtonBase
                aria-label="Send"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: tokens.semantic.radius.sm.value,
                  backgroundColor: "primary.main",
                  color: tokens.semantic.color.action.primary.onPrimary.value,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SendIcon />
              </ButtonBase>
            </InputAdornment>
          }
          sx={{ borderRadius: tokens.semantic.radius.lg.value }}
        />

        <Stack spacing={1.5}>
          <Typography
            variant="overline"
            sx={{
              color: tokens.semantic.color.type.muted.value,
              letterSpacing: "0.14em",
              fontSize: "0.65rem",
              fontWeight: 600,
            }}
          >
            Or start with
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(6, minmax(0, 1fr))",
              },
            }}
          >
            {actions.map((action) => (
              <ButtonBase
                key={action.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 0.75,
                  p: 2,
                  borderRadius: tokens.semantic.radius.lg.value,
                  border: `1px solid ${tokens.semantic.color.outline.default.value}`,
                  backgroundColor:
                    tokens.semantic.color.surface.variant.value,
                  transition: "background-color 0.15s",
                  "&:hover": {
                    backgroundColor:
                      tokens.semantic.color.background.base.value,
                  },
                }}
              >
                <Box
                  sx={({ tokens: t }) => ({
                    color: t.semantic.color.type.muted.value,
                    display: "flex",
                  })}
                >
                  {action.icon}
                </Box>
                <Typography variant="textSm" fontWeight={600}>
                  {action.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={({ tokens: t }) => ({
                    color: t.semantic.color.type.muted.value,
                    lineHeight: 1.35,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  })}
                >
                  {action.subtitle}
                </Typography>
              </ButtonBase>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
