import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

interface Vulnerability {
  cve: string;
  title: string;
  severity: "Critical" | "High" | "Medium";
  cvss: number;
  assets: number;
}

const vulnerabilities: Vulnerability[] = [
  {
    cve: "CVE-2026-1847",
    title: "Apache Log4Shell variant — remote code execution",
    severity: "Critical",
    cvss: 9.8,
    assets: 12,
  },
  {
    cve: "CVE-2026-1832",
    title: "OpenSSL buffer overflow — data exfiltration risk",
    severity: "High",
    cvss: 8.1,
    assets: 7,
  },
  {
    cve: "CVE-2026-1798",
    title: "API gateway authentication bypass",
    severity: "Medium",
    cvss: 6.5,
    assets: 4,
  },
];

const severityColor: Record<string, "error" | "warning" | "info"> = {
  Critical: "error",
  High: "warning",
  Medium: "info",
};

export default function PendingVulnerabilities() {
  const { tokens } = useTheme();

  const totalAssets = vulnerabilities.reduce((sum, v) => sum + v.assets, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${tokens.semantic.color.outline.default.value}`,
        borderRadius: tokens.semantic.radius.lg.value,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, py: 2 }}
      >
        <Stack spacing={0.25}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "warning.main",
              }}
            />
            <Typography variant="subtitle1" fontWeight={600}>
              Vulnerabilities pending review
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: tokens.semantic.color.type.muted.value, pl: 2.5 }}
          >
            Flagged by security monitoring agents · Review and assign for
            remediation
          </Typography>
        </Stack>
        <Chip
          label={`${vulnerabilities.length} pending`}
          color="warning"
          size="small"
        />
      </Stack>

      <Divider />

      {vulnerabilities.map((vuln, i) => (
        <Box key={vuln.cve}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, py: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2} flex={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: `${severityColor[vuln.severity]}.main`,
                  flexShrink: 0,
                }}
              />
              <Stack spacing={0.25} flex={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="textSm" fontWeight={600}>
                    {vuln.cve}
                  </Typography>
                  <Typography
                    variant="textSm"
                    sx={{
                      color: tokens.semantic.color.type.muted.value,
                    }}
                  >
                    · {vuln.title}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    label={vuln.severity}
                    color={severityColor[vuln.severity]}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: tokens.semantic.color.type.muted.value,
                    }}
                  >
                    CVSS {vuln.cvss} · {vuln.assets} assets affected
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button size="small" variant="text">
                Review
              </Button>
              <Button size="small" variant="contained">
                Assign &amp; remediate
              </Button>
            </Stack>
          </Stack>
          {i < vulnerabilities.length - 1 && <Divider />}
        </Box>
      ))}

      <Divider />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 3, py: 1.5 }}
      >
        <Typography
          variant="caption"
          sx={{ color: tokens.semantic.color.type.muted.value }}
        >
          Total affected assets: {totalAssets}
        </Typography>
        <Link
          component="button"
          variant="caption"
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Assign all →
        </Link>
      </Stack>
    </Paper>
  );
}
