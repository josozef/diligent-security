import { Box, Stack, Typography, useTheme } from "@mui/material";

const logEntries = [
  {
    source: "Vulnerability scanner",
    message:
      "Weekly production scan completed — 3 new CVEs identified, 2 critical.",
  },
  {
    source: "Risk register",
    message:
      "Auto-updated risk scores for 8 assets based on new threat intelligence data.",
  },
  {
    source: "Compliance monitor",
    message:
      "NIST CSF control assessment 94% complete — 3 controls pending review.",
  },
  {
    source: "Vendor risk",
    message:
      "Annual security certification for Cloudflare verified and archived.",
  },
  {
    source: "Threat intelligence",
    message:
      "Updated threat feed — 12 new indicators of compromise added to watchlist.",
  },
];

export default function SystemLog() {
  const { tokens } = useTheme();

  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.25}>
        <Typography
          variant="overline"
          sx={{
            color: tokens.semantic.color.type.muted.value,
            letterSpacing: 1.5,
            fontSize: "0.65rem",
          }}
        >
          System log
        </Typography>
        <Typography
          variant="textSm"
          sx={{ color: tokens.semantic.color.type.muted.value }}
        >
          Recent system activity (last 24 hours)
        </Typography>
      </Stack>

      <Stack spacing={1}>
        {logEntries.map((entry) => (
          <Stack key={entry.source} direction="row" spacing={1} alignItems="baseline">
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: tokens.semantic.color.type.muted.value,
                flexShrink: 0,
                mt: 1,
              }}
            />
            <Typography variant="textSm">
              <Typography
                component="span"
                variant="textSm"
                fontWeight={600}
              >
                {entry.source}:
              </Typography>{" "}
              <Typography
                component="span"
                variant="textSm"
                sx={{ color: tokens.semantic.color.type.muted.value }}
              >
                {entry.message}
              </Typography>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
