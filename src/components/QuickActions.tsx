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
import AssetInventoryIcon from "@diligentcorp/atlas-react-bundle/icons/AssetInventory";
import ReportsIcon from "@diligentcorp/atlas-react-bundle/icons/Reports";
import AiSearchIcon from "@diligentcorp/atlas-react-bundle/icons/AiSearch";
import IssueTrackerIcon from "@diligentcorp/atlas-react-bundle/icons/IssueTracker";
import FrameworksIcon from "@diligentcorp/atlas-react-bundle/icons/Frameworks";
import SendIcon from "@diligentcorp/atlas-react-bundle/icons/Send";
import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";

const actions = [
  { icon: <AutomatedIcon />, label: "Run scan", subtitle: "Scan environments" },
  { icon: <AssetInventoryIcon />, label: "View assets", subtitle: "Asset inventory" },
  { icon: <ReportsIcon />, label: "Risk report", subtitle: "Generate report" },
  { icon: <AiSearchIcon />, label: "AI search", subtitle: "Ask anything" },
  { icon: <IssueTrackerIcon />, label: "Create ticket", subtitle: "Log a new issue" },
  { icon: <FrameworksIcon />, label: "Compliance", subtitle: "Framework status" },
];

export default function QuickActions() {
  const { tokens } = useTheme();

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
              sx={({ tokens }) => ({
                color: tokens.semantic.color.type.muted.value,
              })}
            >
              Ask questions or choose an action below. Work entirely within
              Diligent.
            </Typography>
          </Stack>
          <Chip
            icon={<AiSparkleIcon />}
            label="Dina"
            size="small"
            color="success"
          />
        </Stack>

        <OutlinedInput
          fullWidth
          placeholder="Ask a question or describe what you need..."
          endAdornment={
            <InputAdornment position="end">
              <ButtonBase
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  color: "#fff",
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
            sx={({ tokens }) => ({
              color: tokens.semantic.color.type.muted.value,
              letterSpacing: 1.5,
              fontSize: "0.65rem",
            })}
          >
            Or start with
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 1.5,
            }}
          >
            {actions.map((action) => (
              <ButtonBase
                key={action.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
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
                  sx={({ tokens }) => ({
                    color: tokens.semantic.color.type.muted.value,
                    display: "flex",
                  })}
                >
                  {action.icon}
                </Box>
                <Typography variant="textSm" fontWeight={600} noWrap>
                  {action.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={({ tokens }) => ({
                    color: tokens.semantic.color.type.muted.value,
                  })}
                  noWrap
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
