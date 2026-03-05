import { type ReactNode } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";

interface ChatMessageProps {
  timestamp: string;
  status?: "done" | "in-progress";
  title: string;
  icon?: ReactNode;
  isAction?: boolean;
  children: ReactNode;
}

export default function ChatMessage({
  timestamp,
  status = "done",
  title,
  icon,
  isAction,
  children,
}: ChatMessageProps) {
  const { tokens } = useTheme();

  return (
    <Stack spacing={1}>
      {/* Status + timestamp row */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {!isAction && (
          <>
            <AiSparkleIcon
              style={{
                fontSize: 16,
                color: status === "done"
                  ? tokens.semantic.color.status.success.text.value
                  : tokens.semantic.color.type.muted.value,
              }}
            />
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                color: status === "done"
                  ? tokens.semantic.color.status.success.text.value
                  : tokens.semantic.color.type.muted.value,
              }}
            >
              {status === "done" ? "Done" : "In progress"}
            </Typography>
          </>
        )}
        {isAction && (
          <AiSparkleIcon
            style={{
              fontSize: 16,
              color: tokens.semantic.color.type.muted.value,
            }}
          />
        )}
        <Typography
          variant="caption"
          sx={{ color: tokens.semantic.color.type.muted.value }}
        >
          · {timestamp}
        </Typography>
      </Stack>

      {/* Title */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {icon && (
          <Box sx={{ color: tokens.semantic.color.type.muted.value, display: "flex" }}>
            {icon}
          </Box>
        )}
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </Stack>

      {/* Content */}
      <Box sx={{ color: tokens.semantic.color.type.muted.value }}>
        {children}
      </Box>
    </Stack>
  );
}
