import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { StatusIndicator } from "@diligentcorp/atlas-react-bundle";
import ArrowLeftIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowLeft";
import CheckedCircleIcon from "@diligentcorp/atlas-react-bundle/icons/CheckedCircle";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

// ─── Data ────────────────────────────────────────────────────────────────────

const committees = [
  { id: "audit-risk", label: "Audit & Risk Committee" },
  { id: "full-board", label: "Full Board of Directors" },
  { id: "governance", label: "Governance Committee" },
];

export interface BoardMember {
  id: string;
  name: string;
  title: string;
  committeeId: string;
}

const boardMembers: BoardMember[] = [
  { id: "b1", name: "Catherine Hayes", title: "Board Chair", committeeId: "audit-risk" },
  { id: "b2", name: "Richard Chen", title: "Audit Committee Chair", committeeId: "audit-risk" },
  { id: "b3", name: "Patricia Okonkwo", title: "Risk Committee Member", committeeId: "audit-risk" },
  { id: "b4", name: "Thomas Brennan", title: "Independent Director", committeeId: "audit-risk" },
  { id: "b5", name: "Maria Gonzalez", title: "Independent Director", committeeId: "governance" },
];

// ─── Default document content ────────────────────────────────────────────────

const defaultContent = `
<h2 style="text-align: center">SECURITY INCIDENT EXECUTIVE BRIEFING</h2>
<p style="text-align: center"><em>Prepared for the Audit and Risk Committee</em></p>
<p style="text-align: center">Date: March 4, 2026 &nbsp;·&nbsp; Classification: Confidential — Board Eyes Only</p>
<p style="text-align: center">Incident Reference: CVE-2026-1847</p>
<hr>
<h3>1. Incident Overview</h3>
<p>A critical vulnerability (<strong>CVE-2026-1847</strong>, CVSS 9.8) was identified in <strong>CrowdStrike Falcon Sensor for Windows</strong> affecting <strong>12 assets</strong> across <strong>3 business-critical systems</strong>. Active exploitation has been confirmed by threat intelligence feeds.</p>
<p><strong>Affected systems:</strong></p>
<ul>
  <li><strong>Payment processing cluster</strong> — 4 production servers (PROD-PAY-01 through 04)</li>
  <li><strong>Customer data platform</strong> — 5 production servers (PROD-CDP-01 through 05)</li>
  <li><strong>Internal HR portal</strong> — 3 servers, staging + production (HR-WEB-01, HR-APP-01, STG-HR-01)</li>
</ul>
<h3>2. Risk and Materiality Assessment</h3>
<p><strong>Inherent Risk Level: Critical</strong></p>
<p>The vulnerability involves active exploitation targeting production payment processing infrastructure within PCI scope. Potential customer data exposure across 5 customer data platform servers. This incident is assessed as <strong>likely material</strong> under SEC guidelines.</p>
<p><strong>Recommendation:</strong> Escalation to CISO and General Counsel for SEC 8-K / 10-K materiality evaluation.</p>
<h3>3. Compliance Impact</h3>
<p>The following regulatory frameworks have been assessed as <strong>At Risk</strong>:</p>
<ul>
  <li><strong>SOC 2 Type II</strong> — CC6.1 (Logical and physical access controls), CC7.2 (System monitoring and anomaly detection)</li>
  <li><strong>ISO 27001:2022</strong> — A.12.6.1 (Management of technical vulnerabilities)</li>
  <li><strong>NIST CSF 2.0</strong> — ID.RA-1 (Asset vulnerabilities identified and documented)</li>
  <li><strong>PCI DSS v4.0</strong> — Req 6.3.3 (Patch critical vulnerabilities within 30 days)</li>
</ul>
<p>4 failed controls have been identified and linked to remediation tickets.</p>
<h3>4. Remediation Status</h3>
<p><strong>5 ITSM tickets</strong> have been created and assigned:</p>
<ol>
  <li><strong>ITSM-4821:</strong> Payment processing cluster (Critical) — Due tomorrow 6:00 AM</li>
  <li><strong>ITSM-4822:</strong> Customer data platform (Critical) — Due tomorrow 6:00 AM</li>
  <li><strong>ITSM-4823:</strong> Internal HR portal (High) — Due Mar 6, 12:00 PM</li>
  <li><strong>ITSM-4824:</strong> Governance remediation — Failed control documentation (High) — Due Mar 7</li>
  <li><strong>ITSM-4825:</strong> Risk register update — Residual risk recalculation (Medium) — Due Mar 7</li>
</ol>
<p><strong>Interim compensating controls activated:</strong></p>
<ul>
  <li>Network segmentation applied to isolate affected production servers</li>
  <li>Enhanced monitoring rules activated for lateral movement indicators</li>
  <li>Temporary WAF rules deployed to block known exploit payloads</li>
  <li>CrowdStrike prevention policy escalated to maximum enforcement</li>
</ul>
<h3>5. Stakeholder Notifications</h3>
<p>Context-aware notifications have been sent to the following key stakeholders:</p>
<ul>
  <li><strong>Sarah Chen</strong> — Chief Information Security Officer</li>
  <li><strong>Michael Torres</strong> — General Counsel</li>
  <li><strong>Priya Sharma</strong> — VP of Infrastructure</li>
  <li><strong>James Whitfield</strong> — Director of Compliance</li>
  <li><strong>Angela Martinez</strong> — IT Risk Manager</li>
</ul>
<h3>6. Recommended Board Actions</h3>
<ol>
  <li>Review and confirm materiality assessment for SEC disclosure purposes</li>
  <li>Approve emergency remediation budget if required</li>
  <li>Direct General Counsel to evaluate 8-K filing timeline</li>
  <li>Schedule follow-up briefing in 48 hours for remediation verification</li>
</ol>
<hr>
<p><em>This briefing was auto-generated by the Diligent Security Incident Governance workflow and reviewed by the incident response team. All data is sourced from Asset Manager, Risk Manager, and the ITSM platform.</em></p>
`;

// ─── Props ───────────────────────────────────────────────────────────────────

interface BoardBriefingPanelProps {
  onBack?: () => void;
  onSend?: () => void;
  completed?: boolean;
  completedAt?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BoardBriefingPanel({
  onBack,
  onSend,
  completed,
  completedAt,
}: BoardBriefingPanelProps) {
  const { tokens } = useTheme();
  const [selectedCommittee, setSelectedCommittee] = useState("audit-risk");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    () => new Set(boardMembers.filter((m) => m.committeeId === "audit-risk").map((m) => m.id)),
  );

  const visibleMembers = boardMembers.filter((m) => m.committeeId === selectedCommittee);

  const handleCommitteeChange = useCallback((id: string) => {
    setSelectedCommittee(id);
    setSelectedMembers(new Set(boardMembers.filter((m) => m.committeeId === id).map((m) => m.id)));
  }, []);

  const toggleMember = useCallback((id: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultContent,
    editable: !completed,
  });

  return (
    <Stack spacing={0} sx={{ height: "100%" }}>
      {/* Panel header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
          backgroundColor: tokens.semantic.color.surface.default.value,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            {onBack && (
              <IconButton size="small" onClick={onBack}>
                <ArrowLeftIcon />
              </IconButton>
            )}
            <Typography variant="subtitle1" fontWeight={600}>
              Board briefing
            </Typography>
          </Stack>
          {completed && (
            <StatusIndicator
              icon={<CheckedCircleIcon />}
              label={completedAt ? `Sent ${completedAt}` : "Sent"}
              size="small"
              color="success"
            />
          )}
        </Stack>
      </Box>

      {/* Scrollable body */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          backgroundColor: tokens.semantic.color.surface.subtle.value,
        }}
      >
        <Stack spacing={1.5}>
          {/* Recipient selection */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              overflow: "hidden",
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}` }}>
              <Typography variant="textSm" fontWeight={600}>Recipients</Typography>
            </Box>

            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ display: "block", mb: 0.75, color: tokens.semantic.color.type.muted.value }}
              >
                Committee
              </Typography>
              <Select
                size="medium"
                fullWidth
                value={selectedCommittee}
                onChange={(e) => handleCommitteeChange(e.target.value)}
                disabled={completed}
                sx={{ mb: 1.5 }}
              >
                {committees.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
                ))}
              </Select>

              <Stack divider={<Divider />}>
                {visibleMembers.map((m) => (
                  <Stack
                    key={m.id}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ py: 1.25 }}
                  >
                    <Checkbox
                      size="small"
                      checked={selectedMembers.has(m.id)}
                      onChange={() => toggleMember(m.id)}
                      disabled={completed}
                      sx={{ p: 0.5 }}
                    />
                    <Stack spacing={0}>
                      <Typography variant="textSm" fontWeight={600}>{m.name}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: tokens.semantic.color.type.muted.value }}
                      >
                        {m.title}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Paper>

          {/* Document editor */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: tokens.semantic.radius.md.value,
              backgroundColor: tokens.semantic.color.surface.default.value,
              border: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
              overflow: "hidden",
            }}
          >
            {/* Toolbar */}
            {editor && !completed && (
              <Box
                sx={{
                  px: 1,
                  py: 0.5,
                  borderBottom: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
                  backgroundColor: tokens.semantic.color.surface.variant.value,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                  flexWrap: "wrap",
                }}
              >
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                  label="↩"
                  title="Undo"
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                  label="↪"
                  title="Redo"
                />
                <ToolbarDivider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  active={editor.isActive("heading", { level: 2 })}
                  label="H2"
                  title="Heading 2"
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  active={editor.isActive("heading", { level: 3 })}
                  label="H3"
                  title="Heading 3"
                />
                <ToolbarDivider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  active={editor.isActive("bulletList")}
                  label="•"
                  title="Bullet list"
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  active={editor.isActive("orderedList")}
                  label="1."
                  title="Ordered list"
                />
                <ToolbarDivider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  active={editor.isActive("bold")}
                  label="B"
                  title="Bold"
                  bold
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  active={editor.isActive("italic")}
                  label="I"
                  title="Italic"
                  italic
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  active={editor.isActive("underline")}
                  label="U"
                  title="Underline"
                  underline
                />
                <ToolbarDivider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                  active={editor.isActive({ textAlign: "left" })}
                  label="≡"
                  title="Align left"
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                  active={editor.isActive({ textAlign: "center" })}
                  label="≡"
                  title="Align center"
                  sx={{ transform: "scaleX(-1)" }}
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                  active={editor.isActive({ textAlign: "right" })}
                  label="≡"
                  title="Align right"
                />
              </Box>
            )}

            {/* Editor content */}
            <Box
              sx={{
                px: 4,
                py: 3,
                minHeight: 400,
                "& .tiptap": {
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  color: tokens.semantic.color.type.default.value,
                  "& h2": {
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    margin: "0 0 0.5rem",
                    color: tokens.semantic.color.type.default.value,
                  },
                  "& h3": {
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    margin: "1.25rem 0 0.375rem",
                    color: tokens.semantic.color.type.default.value,
                  },
                  "& p": {
                    margin: "0 0 0.5rem",
                  },
                  "& ul, & ol": {
                    paddingLeft: "1.5rem",
                    margin: "0.25rem 0 0.75rem",
                  },
                  "& li": {
                    marginBottom: "0.25rem",
                  },
                  "& hr": {
                    border: "none",
                    borderTop: `1px solid ${tokens.semantic.color.outline.fixed.value}`,
                    margin: "1rem 0",
                  },
                  "& em": {
                    color: tokens.semantic.color.type.muted.value,
                  },
                },
              }}
            >
              <EditorContent editor={editor} />
            </Box>
          </Paper>

          {/* Send CTA */}
          {!completed && onSend && (
            <Button
              variant="contained"
              fullWidth
              size="medium"
              disabled={selectedMembers.size === 0}
              onClick={onSend}
            >
              Send briefing to {selectedMembers.size} recipient{selectedMembers.size !== 1 ? "s" : ""}
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

// ─── Toolbar sub-components ──────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  active,
  label,
  title,
  bold,
  italic,
  underline,
  sx: sxProp,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  title: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  sx?: Record<string, unknown>;
}) {
  const { tokens } = useTheme();
  return (
    <Box
      component="button"
      onClick={onClick}
      title={title}
      sx={{
        border: "none",
        background: active
          ? tokens.semantic.color.surface.default.value
          : "transparent",
        borderRadius: tokens.semantic.radius.sm.value,
        cursor: "pointer",
        px: 1,
        py: 0.5,
        fontSize: "0.8125rem",
        fontWeight: bold ? 700 : 400,
        fontStyle: italic ? "italic" : "normal",
        textDecoration: underline ? "underline" : "none",
        color: tokens.semantic.color.type.default.value,
        lineHeight: 1,
        minWidth: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          backgroundColor: tokens.semantic.color.surface.default.value,
        },
        ...sxProp,
      }}
    >
      {label}
    </Box>
  );
}

function ToolbarDivider() {
  const { tokens } = useTheme();
  return (
    <Box
      sx={{
        width: 1,
        height: 18,
        backgroundColor: tokens.semantic.color.outline.fixed.value,
        mx: 0.5,
      }}
    />
  );
}
