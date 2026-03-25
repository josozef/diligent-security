import { createContext, useContext } from "react";

export type ThemeMode = "atlas-light" | "atlas-dark";

interface DemoState {
  hasAlerts: boolean;
  setHasAlerts: (v: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (v: ThemeMode) => void;
}

const DemoContext = createContext<DemoState>({
  hasAlerts: true,
  setHasAlerts: () => {},
  themeMode: "atlas-light",
  setThemeMode: () => {},
});

export const useDemo = () => useContext(DemoContext);
export default DemoContext;
