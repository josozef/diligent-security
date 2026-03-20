import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";

export default function PageLayout({
  children,
  gap = 3,
}: PropsWithChildren<{ gap?: number }>) {
  return <Stack gap={gap}>{children}</Stack>;
}
