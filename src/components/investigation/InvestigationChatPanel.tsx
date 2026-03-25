import { Box, Chip, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  AIChatAIMessage,
  AIChatBox,
  AIChatContent,
  AIChatContextProvider,
  AIChatMessageAvatar,
  AIChatMessageHeader,
  AIChatMessageTextBlock,
  AIChatUserMessage,
} from "@diligentcorp/atlas-react-bundle";
import AiSparkleIcon from "@diligentcorp/atlas-react-bundle/icons/AiSparkle";

/** Same conversation copy as `diligent-security-linear` ChatPanel (demo transcript). */
const INVESTIGATION_CHAT_MESSAGES: Array<{
  id: number;
  role: "ai" | "user";
  content: string;
  /** Shown in Atlas AI message headers */
  time: string;
}> = [
  {
    id: 1,
    role: "ai",
    time: "2:10 PM",
    content:
      "I've completed the initial triage of CVE-2026-1847. 12 assets are affected across 3 business-critical systems. Shall I walk you through the compliance impact?",
  },
  {
    id: 2,
    role: "user",
    time: "12:05 PM",
    content: "Yes, what frameworks are affected?",
  },
  {
    id: 3,
    role: "ai",
    time: "2:11 PM",
    content:
      "Four compliance frameworks have potential impact: SOC 2 Type II (CC7.1 — System Operations), ISO 27001 (A.12.6 — Technical Vulnerability Management), NIST CSF (ID.RA-1 — Asset Vulnerabilities), and PCI DSS (Req 6.2 — Security Patches). I've flagged these in the triage report.",
  },
  {
    id: 4,
    role: "user",
    time: "2:12 PM",
    content: "What's the remediation timeline?",
  },
  {
    id: 5,
    role: "ai",
    time: "2:13 PM",
    content:
      "Based on the CVSS 9.8 score and your policy framework, the required remediation window is 24 hours for critical assets. I've drafted 5 ITSM tickets and an emergency change request. The patch is available from CrowdStrike — estimated deployment time is 4-6 hours with your current automation.",
  },
];

function DiligentAgentAvatar() {
  const { tokens } = useTheme();
  return (
    <Box
      component="img"
      src="/diligent-d.svg"
      alt=""
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        objectFit: "contain",
        flexShrink: 0,
        backgroundColor: tokens.semantic.color.surface.default.value,
        border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
        boxSizing: "border-box",
      }}
    />
  );
}

function InvestigationChatInput() {
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AIChatBox
      isUploadAvailable
      onSubmit={() => false}
      slotProps={{
        root: { sx: { width: "100%", maxWidth: "100%", alignSelf: "stretch" } },
        textField: {
          placeholder: "Ask a question...",
          label: "Ask the assistant",
          slotProps: { textField: { minRows: isMobileViewport ? 1 : 2, maxRows: isMobileViewport ? 4 : 6 } },
        },
        disclaimer: { stackProps: { sx: { display: "none" } } },
        submitButton: { submitButtonAriaLabel: "Send message", stopButtonAriaLabel: "Stop generating" },
        uploadButton: { ariaLabel: "Attach file" },
      }}
    />
  );
}

export default function InvestigationChatPanel() {
  const { tokens } = useTheme();

  return (
    <AIChatContextProvider>
      <Box
        sx={{
          width: 320,
          flexShrink: 0,
          borderLeft: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          display: "flex",
          flexDirection: "column",
          backgroundColor: tokens.semantic.color.surface.default.value,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            flexShrink: 0,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <AiSparkleIcon style={{ fontSize: 18, color: tokens.semantic.color.type.muted.value }} />
            <Box>
              <Typography variant="textSm" fontWeight={600}>
                AI Security Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: tokens.semantic.color.type.muted.value, display: "block", lineHeight: 1.35 }}>
                Context for this incident
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", px: 2, py: 1.5 }}>
          <AIChatContent>
            <Stack spacing={2.5}>
              {INVESTIGATION_CHAT_MESSAGES.map((msg) =>
                msg.role === "user" ? (
                  <AIChatUserMessage
                    key={msg.id}
                    alignment="end"
                    message={msg.content}
                    header={
                      <AIChatMessageHeader
                        name="Sarah McKinsey"
                        time={msg.time}
                        avatar={<AIChatMessageAvatar uniqueId="sarah.mckinsey" initials="SM" />}
                      />
                    }
                  />
                ) : (
                  <AIChatAIMessage
                    key={msg.id}
                    header={
                      <AIChatMessageHeader
                        name="Diligent Agentforce"
                        time={msg.time}
                        avatar={<DiligentAgentAvatar />}
                        slotProps={{
                          name: { sx: { fontWeight: 600 } },
                        }}
                      >
                        <Chip
                          size="small"
                          variant="outlined"
                          label="Low priority"
                          sx={({ tokens }) => ({
                            height: 22,
                            fontSize: "0.7rem",
                            borderColor: tokens.semantic.color.outline.fixed.value,
                            color: tokens.semantic.color.type.muted.value,
                            "& .MuiChip-label": { px: 1 },
                          })}
                        />
                      </AIChatMessageHeader>
                    }
                  >
                    <AIChatMessageTextBlock>{msg.content}</AIChatMessageTextBlock>
                  </AIChatAIMessage>
                ),
              )}
            </Stack>
          </AIChatContent>
        </Box>

        <Box
          sx={{
            px: 1,
            py: 1,
            borderTop: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
            flexShrink: 0,
          }}
        >
          <InvestigationChatInput />
        </Box>
      </Box>
    </AIChatContextProvider>
  );
}
