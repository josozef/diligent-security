import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
  return <Stack gap={3}>{children}</Stack>;
}
