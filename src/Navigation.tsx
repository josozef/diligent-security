import { RoutedNavLink } from "@diligentcorp/atlas-react-bundle/global-nav";
import MissionControlIcon from "@diligentcorp/atlas-react-bundle/icons/MissionControl";
import SettingsIcon from "@diligentcorp/atlas-react-bundle/icons/Settings";

export default function Navigation() {
  return (
    <>
      <RoutedNavLink to="/" label="Command center">
        <MissionControlIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/settings" label="Settings">
        <SettingsIcon slot="icon" />
      </RoutedNavLink>
    </>
  );
}
