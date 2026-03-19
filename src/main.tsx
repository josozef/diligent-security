import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { AtlasThemeProvider } from "@diligentcorp/atlas-react-bundle";
import DemoContext, { type ThemeMode } from "./DemoContext";
import App from "./App";

function Root() {
  const [hasAlerts, setHasAlerts] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>("atlas-dark");

  return (
    <DemoContext.Provider value={{ hasAlerts, setHasAlerts, themeMode, setThemeMode }}>
      <AtlasThemeProvider tokenMode={themeMode}>
        <App />
      </AtlasThemeProvider>
    </DemoContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
);
