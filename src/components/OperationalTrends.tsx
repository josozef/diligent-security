import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useLayoutEffect, useRef, useState } from "react";

/** Last 14 days — synthetic demo series for command center monitoring. */
const DAY_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

const FAILED_SIGN_INS = [1280, 1190, 1050, 980, 920, 880, 760, 710, 640, 590, 520, 480, 430, 390];

const CRITICAL_VULNS = [14, 15, 14, 16, 15, 13, 12, 12, 11, 10, 9, 9, 8, 7];

const MTTA_P1_HOURS = [4.2, 3.9, 4.1, 3.6, 3.4, 3.2, 3.0, 2.9, 2.8, 2.6, 2.5, 2.4, 2.3, 2.2];

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setWidth(Math.max(240, el.clientWidth));
    });
    ro.observe(el);
    setWidth(Math.max(240, el.clientWidth));
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

interface TrendCardProps {
  title: string;
  caption: string;
  data: readonly number[];
  color: string;
  valueLabel: string;
}

function TrendCard({ title, caption, data, color, valueLabel }: TrendCardProps) {
  const theme = useTheme();
  const { tokens } = theme;
  const muted = tokens.semantic.color.type.muted.value;
  const outline = tokens.semantic.color.outline.default.value;
  const { ref, width } = useContainerWidth();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${outline}`,
        borderRadius: tokens.semantic.radius.md.value,
        p: 1.5,
        bgcolor: tokens.semantic.color.surface.default.value,
      }}
    >
      <Stack spacing={0.75}>
        <Stack spacing={0.25}>
          <Typography variant="caption" fontWeight={600} sx={{ letterSpacing: "0.02em" }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: muted, lineHeight: 1.35, fontSize: "0.7rem" }}>
            {caption}
          </Typography>
        </Stack>
        <Box ref={ref} sx={{ width: "100%", minHeight: 132 }}>
          <LineChart
            width={width}
            height={132}
            hideLegend
            skipAnimation
            colors={[color]}
            margin={{ left: 0, right: 8, top: 4, bottom: 20 }}
            grid={{ horizontal: true, vertical: false }}
            xAxis={[
              {
                id: "days",
                data: [...DAY_LABELS],
                scaleType: "point",
                tickLabelStyle: { fontSize: 9, fill: muted },
              },
            ]}
            yAxis={[
              {
                id: "value",
                tickLabelStyle: { fontSize: 9, fill: muted },
                width: 34,
              },
            ]}
            series={[
              {
                type: "line",
                id: valueLabel,
                label: valueLabel,
                xAxisId: "days",
                yAxisId: "value",
                data: [...data],
                showMark: false,
                curve: "natural",
              },
            ]}
            slotProps={{
              line: { strokeWidth: 2 },
            }}
            sx={{
              "& .MuiChartsAxis-line": { stroke: outline },
              "& .MuiChartsAxis-tick": { stroke: outline },
              "& .MuiChartsGrid-line": { stroke: outline, strokeOpacity: 0.35 },
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}

export const OPERATIONAL_TRENDS_TITLE = "Operational trends";

export const OPERATIONAL_TRENDS_SUBTITLE =
  "Rolling 14-day view of signals we watch for your environment (demo data).";

export function OperationalMonitoringCharts() {
  const { tokens } = useTheme();
  const blue = tokens.semantic.color.dataVisualization.qualitative.blue["04"].value;
  const alert = tokens.semantic.color.status.error.default.value;
  const positive = tokens.semantic.color.status.success.default.value;

  return (
    <Stack spacing={1.75} sx={{ minWidth: 0 }}>
      <TrendCard
        title="Failed sign-in attempts"
        caption="Identity perimeter — lower is better. Spikes often precede password-spray campaigns."
        data={FAILED_SIGN_INS}
        color={blue}
        valueLabel="Attempts"
      />
      <TrendCard
        title="Critical vulnerabilities open"
        caption="Assets with CVSS ≥ 9 or active exploit intel. Tracks remediation backlog."
        data={CRITICAL_VULNS}
        color={alert}
        valueLabel="Count"
      />
      <TrendCard
        title="Mean time to acknowledge (P1)"
        caption="Hours from detection to first analyst action on priority-1 incidents."
        data={MTTA_P1_HOURS}
        color={positive}
        valueLabel="Hours"
      />
    </Stack>
  );
}
